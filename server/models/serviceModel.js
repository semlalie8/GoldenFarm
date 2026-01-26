import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    icon: { type: String }, // Optional font-awesome icon class
    price: { type: Number }, // Optional price
    contactInfo: { type: String }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
