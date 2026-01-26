import { getIO } from '../utils/socket.js';
import JournalEntry from '../models/journalEntryModel.js';
import Transaction from '../models/transactionModel.js';
import InventoryTransaction from '../models/inventoryTransactionModel.js';
import IoTEvent from '../models/iotEventModel.js';

/**
 * ChangeStreamService - The Real-time Nervous System.
 * Listens to MongoDB Change Streams and emits Socket.io events to the enterprise dashboards.
 */
class ChangeStreamService {
    constructor() {
        this.watchers = [];
    }

    start() {
        console.log('[ChangeStreamService] Initializing Real-time Nerve Center...');

        this.watchCollection(JournalEntry, 'FINANCE_UPDATE');
        this.watchCollection(Transaction, 'TRANSACTION_UPDATE');
        this.watchCollection(InventoryTransaction, 'INVENTORY_UPDATE');
        this.watchCollection(IoTEvent, 'IOT_CRITICAL_EVENT');
    }

    watchCollection(Model, eventName) {
        try {
            const changeStream = Model.watch([], { fullDocument: 'updateLookup' });

            changeStream.on('change', (change) => {
                console.log(`[ChangeStream] ${eventName} - Detected ${change.operationType}`);

                const io = getIO();

                const payload = {
                    operation: change.operationType,
                    documentKey: change.documentKey,
                    fullDocument: change.fullDocument,
                    timestamp: new Date().toISOString()
                };

                io.emit(eventName, payload);
            });

            changeStream.on('error', (error) => {
                console.warn(`[ChangeStream] ${eventName} Watcher Error:`, error.message);
                // In local dev without replica sets, this will fail. We catch it to prevent server crash.
                if (error.codeName === 'NotPrimaryNoSecondaryOk' || error.message.includes('replica set')) {
                    console.warn(`[ChangeStream] ${eventName} suspended: MongoDB Replica Set not detected.`);
                }
            });

            this.watchers.push(changeStream);

        } catch (error) {
            console.error(`[ChangeStream] Failed to initialize ${eventName}:`, error.message);
        }
    }

    stop() {
        this.watchers.forEach(watcher => watcher.close());
        this.watchers = [];
    }
}

export default new ChangeStreamService();
