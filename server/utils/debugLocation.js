import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoginHistory from '../models/loginHistoryModel.js';
import connectDB from '../config/db.js';
import geoip from 'geoip-lite';

dotenv.config();

const checkLocationData = async () => {
    try {
        await connectDB();

        // 1. Test GeoIP
        const testIp = '105.159.99.166'; // Rabat IP
        const geo = geoip.lookup(testIp);
        console.log('GeoIP Test for ' + testIp + ':', geo);

        // 2. Check DB Records
        const logs = await LoginHistory.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('\nRecent DB Logs:');
        logs.forEach(log => {
            console.log(`- Time: ${log.loginTime}`);
            console.log(`  IP: ${log.ipAddress}`);
            console.log(`  Location: ${log.city}, ${log.country}`);
            console.log(`  Distance: ${log.distanceFromHQ} km`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkLocationData();
