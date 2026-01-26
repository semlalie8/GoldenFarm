import asyncHandler from 'express-async-handler';
import inventoryService from '../services/inventoryService.js';
import InventoryBatch from '../models/inventoryBatchModel.js';
import Product from '../models/productModel.js';
import Warehouse from '../models/warehouseModel.js';
import InventoryTransaction from '../models/inventoryTransactionModel.js';

/**
 * @desc    Create a new Inventory Batch (Biological/Product)
 * @route   POST /api/inventory/batch
 * @access  Private/Admin (Operations)
 */
export const createBatch = asyncHandler(async (req, res) => {
    const batch = await inventoryService.createBatch(req.body, req.user._id);
    res.status(201).json(batch);
});

/**
 * @desc    Record a Health Event (Vaccination/Illness)
 * @route   POST /api/inventory/batch/:id/health
 * @access  Private/Admin (Vet/Manager)
 */
export const recordHealthEvent = asyncHandler(async (req, res) => {
    const batch = await inventoryService.recordHealthEvent(req.params.id, req.body, req.user._id);
    res.json(batch);
});

/**
 * @desc    Update Batch Valuation (IAS 41 Fair Value)
 * @route   POST /api/inventory/batch/:id/valuation
 * @access  Private/Admin (Accountant)
 */
export const updateValuation = asyncHandler(async (req, res) => {
    const { unitMarketPrice } = req.body;
    const batch = await inventoryService.updateValuation(req.params.id, unitMarketPrice, req.user._id);
    res.json(batch);
});

/**
 * @desc    Get real-time stock visibility across warehouses
 * @route   GET /api/inventory/status
 * @access  Private/Admin
 */
export const getInventoryStatus = asyncHandler(async (req, res) => {
    const products = await Product.find({ status: 'Active' });
    const warehouses = await Warehouse.find({ isActive: true });

    // Aggregation to find stock per product per warehouse
    const stats = await InventoryTransaction.aggregate([
        {
            $group: {
                _id: { productId: "$product", warehouseId: "$warehouse" },
                totalStock: { $sum: "$quantity" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id.productId",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $lookup: {
                from: "warehouses",
                localField: "_id.warehouseId",
                foreignField: "_id",
                as: "warehouseInfo"
            }
        }
    ]);

    res.json({
        warehouses,
        stockData: stats,
        totalSkus: products.length
    });
});

/**
 * @desc    Adjust stock (Manual Count, Adjustment)
 * @route   POST /api/inventory/adjust
 * @access  Private/Admin
 */
export const adjustStock = asyncHandler(async (req, res) => {
    const { productId, warehouseId, quantity, reason, notes } = req.body;

    const transaction = await InventoryTransaction.create({
        product: productId,
        warehouse: warehouseId,
        type: 'ADJUSTMENT',
        quantity,
        reason,
        notes,
        performedBy: req.user._id
    });

    // Update master stock in Product model
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });

    res.status(201).json(transaction);
});

/**
 * @desc    Receive Goods (Goods Receipt Note - GRN)
 * @route   POST /api/inventory/receive
 * @access  Private/Admin
 */
export const receiveGoods = asyncHandler(async (req, res) => {
    const { productId, warehouseId, quantity, unitCost, reference, batchNumber } = req.body;

    // Create or find Batch
    let batch;
    if (batchNumber) {
        batch = await InventoryBatch.findOneAndUpdate(
            { batchNumber },
            { $inc: { 'quantity.current': quantity } },
            { upsert: true, new: true }
        );
    }

    const transaction = await InventoryTransaction.create({
        product: productId,
        warehouse: warehouseId,
        type: 'IN',
        quantity,
        unitCost,
        totalValue: quantity * unitCost,
        reference,
        batch: batch?._id,
        reason: 'PO_RECEIPT',
        performedBy: req.user._id
    });

    // Update Product Master Stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });

    res.status(201).json(transaction);
});

/**
 * @desc    Get Inventory Transaction History (Audit Trail)
 * @route   GET /api/inventory/logs
 * @access  Private/Admin
 */
export const getInventoryLogs = asyncHandler(async (req, res) => {
    const logs = await InventoryTransaction.find({})
        .populate('product', 'name sku')
        .populate('warehouse', 'name')
        .populate('performedBy', 'name')
        .sort('-createdAt')
        .limit(100);

    res.json(logs);
});
