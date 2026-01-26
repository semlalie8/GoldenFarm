import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

dotenv.config();

const debugAuth = async () => {
    try {
        await connectDB();

        const email = 'admin@goldenfarm.com';
        const users = await User.find({ email });

        console.log(`Found ${users.length} users with email: ${email}`);

        for (const user of users) {
            console.log(`\nChecking User: ${user.name} (${user._id})`);
            console.log(`Stored Password Hash: ${user.password}`);

            const isMehdi = await bcrypt.compare('mehdi123', user.password);
            console.log(`Matches 'mehdi123'? ${isMehdi}`);

            const isAli = await bcrypt.compare('ali123', user.password);
            console.log(`Matches 'ali123'? ${isAli}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugAuth();
