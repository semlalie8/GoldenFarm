import mongoose from 'mongoose';

const warehouseSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    location: {
        address: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    type: {
        type: String,
        enum: ['Dry', 'Cold', 'Processing', 'Virtual'],
        default: 'Dry'
    },
    capacity: {
        totalVolume: Number, // in m3
        totalWeight: Number  // in kg
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
