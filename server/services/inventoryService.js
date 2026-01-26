import InventoryBatch from '../models/inventoryBatchModel.js';
import auditService from './auditService.js';

class InventoryService {

    /**
     * Create a new tracking batch (Biological or Material)
     */
    async createBatch(data, userId) {
        // Auto-calculate initial total value
        if (data.valuation && data.quantity) {
            data.valuation.totalValue = data.quantity.current * data.valuation.unitCost;
        }

        const batch = await InventoryBatch.create(data);

        await auditService.log({
            user: userId,
            action: 'BATCH_CREATE',
            module: 'INVENTORY',
            details: { batchNumber: batch.batchNumber, type: batch.type, value: batch.valuation?.totalValue },
            status: 'SUCCESS'
        });

        return batch;
    }

    /**
     * Update Biological Asset Valuation (IAS 41)
     * Re-calculates value based on new weight/market price.
     */
    async updateValuation(batchId, newUnitMarketPrice, userId) {
        const batch = await InventoryBatch.findById(batchId);
        if (!batch) throw new Error('Batch not found');

        const previousValue = batch.valuation.totalValue;

        // Update Valuation
        batch.valuation.marketValue = newUnitMarketPrice;
        batch.valuation.totalValue = batch.quantity.current * newUnitMarketPrice;
        batch.valuation.lastValuationDate = new Date();

        await batch.save();

        await auditService.log({
            user: userId,
            action: 'ASSET_VALUATION_UPDATE',
            module: 'INVENTORY',
            previousState: { totalValue: previousValue },
            newState: { totalValue: batch.valuation.totalValue },
            details: {
                batchId: batch._id,
                reason: 'Market Price Adjustment'
            }
        });

        return batch;
    }

    /**
     * Record a health event (Vaccination, Sickness)
     */
    async recordHealthEvent(batchId, event, userId) {
        const batch = await InventoryBatch.findById(batchId);
        if (!batch) throw new Error('Batch not found');

        batch.biologicalDetails.healthStatus = event.status || batch.biologicalDetails.healthStatus;
        if (event.vaccine) {
            batch.biologicalDetails.vaccinationHistory.push({
                vaccine: event.vaccine,
                date: new Date(),
                vet: event.vet
            });
        }

        await batch.save();

        await auditService.log({
            user: userId,
            action: 'HEALTH_EVENT_RECORD',
            module: 'INVENTORY',
            details: { batchNumber: batch.batchNumber, eventType: event.type }
        });

        return batch;
    }
}

export default new InventoryService();
