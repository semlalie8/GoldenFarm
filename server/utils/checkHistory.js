import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoginHistory from '../models/loginHistoryModel.js';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

dotenv.config();

const checkHistory = async () => {
    try {
        await connectDB();

        const count = await LoginHistory.countDocuments();
        console.log(`Total LoginHistory records: ${count}`);

        const logs = await LoginHistory.find({}).populate('user', 'name email');
        console.log('Recent Logs:');
        logs.forEach(log => {
            console.log(`- User: ${log.user ? log.user.name : 'Unknown'} (${log.user ? log.user.email : 'No Email'}), Time: ${log.loginTime}`);
        });

        if (count === 0) {
            console.log('No logs found. Attempting to create a test log...');
            const user = await User.findOne({ email: 'admin@goldenfarm.com' });
            if (user) {
                await LoginHistory.create({
                    user: user._id,
                    ipAddress: '127.0.0.1',
                    userAgent: 'Test Script'
                });
                console.log('Test log created.');
            } else {
                console.log('Admin user not found for test log.');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkHistory();
