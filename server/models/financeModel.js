import mongoose from 'mongoose';
import LedgerAccount from './ledgerAccountModel.js';
import JournalEntry from './journalEntryModel.js';

/**
 * financeModel.js now serves as a central export point for Financial models
 * while maintaining backward compatibility for files that import from here.
 */

export { LedgerAccount as Account, JournalEntry };
