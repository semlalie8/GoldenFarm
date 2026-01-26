import mongoose from 'mongoose';

const inventoryBatchSchema = mongoose.Schema({
    batchNumber: { type: String, required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

    // Inventory Type
    type: {
        type: String,
        enum: ['CROP', 'LIVESTOCK', 'MATERIAL', 'PRODUCT'],
        required: true
    },

    // Crowdfunding Context
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },

    // Life Cycle
    acquisitionDate: Date,
    expiryDate: Date,

    // Biological Asset Details (The Living Ledger)
    biologicalDetails: {
        breed: String,
        origin: String, // e.g., 'Imported - Spain', 'Local - Souss'
        dateOfBirth: Date,
        healthStatus: {
            type: String,
            enum: ['HEALTHY', 'SICK', 'QUARANTINE', 'DECEASED'],
            default: 'HEALTHY'
        },
        vaccinationHistory: [{
            vaccine: String,
            date: Date,
            vet: String
        }]
    },

    quantity: {
        initial: { type: Number, required: true },
        current: { type: Number, required: true },
        unit: { type: String, default: 'UNIT' } // UNIT, KG, TON
    },

    // Financial Valuation (IAS 41 Agriculture)
    valuation: {
        unitCost: { type: Number, default: 0 }, // Historical Cost
        marketValue: { type: Number, default: 0 }, // Fair Value
        totalValue: { type: Number, default: 0 },
        lastValuationDate: Date
    },

    location: {
        warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
        zone: String
    },

    status: {
        type: String,
        enum: ['PLANNED', 'ACTIVE', 'SOLD', 'CONSUMED', 'WRITTEN_OFF'],
        default: 'ACTIVE'
    },

    certifications: [String], // Organic, FairTrade, etc.
    qrCode: String  // Traceability Link
}, {
    timestamps: true
});

const InventoryBatch = mongoose.model('InventoryBatch', inventoryBatchSchema);
export default InventoryBatch;
