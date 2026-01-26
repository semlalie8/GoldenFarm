import mongoose from 'mongoose';

const inventoryTransactionSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    type: {
        type: String,
        enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'RESERVATION', 'SPOILAGE', 'RETURN'],
        required: true
    },
    quantity: { type: Number, required: true },
    reason: { type: String }, // e.g., 'PO_RECEIPT', 'CUSTOMER_ORDER', 'ANNUAL_COUNT'
    reference: { type: String }, // Invoice#, PO#, Order#

    // Financial Tracking
    unitCost: { type: Number }, // Cost at time of transaction
    totalValue: { type: Number },

    // Metadata
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryBatch' },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String
}, {
    timestamps: true
});

// Index for high-speed stock calculation
inventoryTransactionSchema.index({ product: 1, warehouse: 1, createdAt: -1 });

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
export default InventoryTransaction;
