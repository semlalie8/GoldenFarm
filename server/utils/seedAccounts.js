import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import LedgerAccount from '../models/ledgerAccountModel.js';
import { MOROCCAN_CHART_OF_ACCOUNTS } from './moroccanFinanceConstants.js';

dotenv.config();
connectDB();

const seedAccounts = async () => {
    try {
        await LedgerAccount.deleteMany();
        console.log('Cleared existing accounts.');

        const createdAccounts = await LedgerAccount.insertMany(MOROCCAN_CHART_OF_ACCOUNTS);
        console.log(`${createdAccounts.length} Moroccan Ledger Accounts Seeded!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding accounts:', error.message);
        process.exit(1);
    }
};

seedAccounts();
