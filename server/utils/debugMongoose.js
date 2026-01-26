import mongoose from 'mongoose';

const originalModel = mongoose.model;

mongoose.model = function (name, schema, collection) {
    console.log(`[DEBUG_MONGOOSE] Registering model: '${name}'`);
    try {
        if (mongoose.models[name]) {
            console.warn(`[DEBUG_MONGOOSE] WARNING: Model '${name}' already exists! causing OverwriteModelError soon...`);
            // return mongoose.models[name]; // OPTIONAL FORCE FIX
        }
        return originalModel.call(this, name, schema, collection);
    } catch (error) {
        console.error(`[DEBUG_MONGOOSE] ERROR registering '${name}':`, error.message);
        throw error;
    }
};

export default mongoose;
