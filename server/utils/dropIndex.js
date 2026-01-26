import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

dotenv.config();

const dropEmailIndex = async () => {
    try {
        await connectDB();
        const collection = mongoose.connection.db.collection('users');

        // Check if index exists
        const indexes = await collection.indexes();
        const emailIndex = indexes.find(idx => idx.key.email === 1);

        if (emailIndex) {
            await collection.dropIndex('email_1');
            console.log('Successfully dropped email_1 index');
        } else {
            console.log('email_1 index not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error dropping index:', error);
        process.exit(1);
    }
};

dropEmailIndex();
