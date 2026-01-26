import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

dotenv.config();

const testLogin = async () => {
    try {
        await connectDB();

        // Test 1: Find users with admin email
        const users = await User.find({ email: 'admin@goldenfarm.com' });
        console.log('\n=== Finding Admin Users ===');
        console.log(`Found ${users.length} users with admin@goldenfarm.com`);

        for (const user of users) {
            console.log(`\nUser: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash: ${user.password.substring(0, 20)}...`);

            // Test password matching
            const testPasswords = ['Mehdi@2024', 'Ali@2024', 'mehdi123', 'ali123'];

            for (const pwd of testPasswords) {
                const match = await user.matchPassword(pwd);
                console.log(`  Password "${pwd}": ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testLogin();
