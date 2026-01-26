import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    description: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    price: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    uom: { type: String, default: 'Unit' }, // Unit, Kg, Liters
    category: { type: String },
    image: { type: String },

    // Inventory Context
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    weight: { type: Number }, // in kg
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },

    status: {
        type: String,
        enum: ['Active', 'Draft', 'Archived', 'Discontinued'],
        default: 'Active'
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    isFeatured: { type: Boolean, default: false },
    tags: [String],
    specifications: [{
        key: String,
        value: String
    }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
