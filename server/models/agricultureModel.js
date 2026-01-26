import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [Lng, Lat]
    },
    totalAreaHectares: { type: Number, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'fallow', 'sold'], default: 'active' }
}, { timestamps: true });

const plotSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true }, // e.g., "North Field A"
    areaHectares: { type: Number, required: true },
    soilType: { type: String },
    irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'rainfed'] },
    currentCropCycle: { type: mongoose.Schema.Types.ObjectId, ref: 'CropCycle' }
}, { timestamps: true });

const cropCycleSchema = new mongoose.Schema({
    plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
    cropName: { type: String, required: true }, // e.g., "Wheat", "Udder Tomatoes"
    variety: { type: String },
    startDate: { type: Date, required: true },
    projectedHarvestDate: { type: Date },
    status: { type: String, enum: ['planting', 'growing', 'harvesting', 'completed', 'failed'], default: 'planting' },
    associatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } // Link to crowdfunding
}, { timestamps: true });

export const Farm = mongoose.model('Farm', farmSchema);
export const Plot = mongoose.model('Plot', plotSchema);
export const CropCycle = mongoose.model('CropCycle', cropCycleSchema);
