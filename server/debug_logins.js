import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoginHistory from './models/loginHistoryModel.js';
import User from './models/userModel.js';

dotenv.config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const count = await LoginHistory.countDocuments();
        console.log('Total login records:', count);

        if (count > 0) {
            const logs = await LoginHistory.find()
                .populate('user', 'name email')
                .limit(5);
            console.log('Sample logs (populated):', JSON.stringify(logs, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkData();
