import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoginHistory from './models/loginHistoryModel.js';
import User from './models/userModel.js';

dotenv.config();

const seedLoginHistory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Clear existing logs
        await LoginHistory.deleteMany({});
        console.log('Cleared existing login history');

        // 2. Get Users
        const users = await User.find({});
        if (users.length === 0) {
            console.log('No users found to seed logs for.');
            process.exit(1);
        }

        const admin = users.find(u => u.role === 'admin') || users[0];
        const others = users.filter(u => u._id.toString() !== admin._id.toString());

        const logs = [];

        // Helper to create log
        const createLog = (user, daysAgo, hoursAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            date.setHours(date.getHours() - hoursAgo);

            return {
                user: user._id,
                loginTime: date,
                ipAddress: daysAgo === 0 ? '196.12.24.11' : `105.15.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Moroccan IP ranges roughly
                userAgent: Math.random() > 0.5
                    ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                city: ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir'][Math.floor(Math.random() * 5)],
                country: 'Morocco',
                distanceFromHQ: Math.floor(Math.random() * 500)
            };
        };

        // 3. Generate Logs

        // Today: ~5 logs
        for (let i = 0; i < 3; i++) logs.push(createLog(admin, 0, i * 2));
        others.forEach(u => logs.push(createLog(u, 0, Math.floor(Math.random() * 5))));

        // Yesterday: ~3 logs
        logs.push(createLog(admin, 1, 4));
        others.forEach(u => logs.push(createLog(u, 1, Math.floor(Math.random() * 10))));

        // Last Week: ~5 logs
        for (let i = 0; i < 5; i++) {
            const user = Math.random() > 0.5 ? admin : others[0];
            logs.push(createLog(user, Math.floor(Math.random() * 6) + 1));
        }

        // Last Month: ~10 logs
        for (let i = 0; i < 10; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            logs.push(createLog(user, Math.floor(Math.random() * 25) + 7));
        }

        await LoginHistory.insertMany(logs);
        console.log(`Seeded ${logs.length} login history records.`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedLoginHistory();
