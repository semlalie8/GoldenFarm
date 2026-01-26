import IoTDevice from '../models/iotDeviceModel.js';
import IoTTelemetry from '../models/iotTelemetryModel.js';
import IoTEvent from '../models/iotEventModel.js';
import { emitEvent } from '../utils/socket.js';

class IoTService {

    /**
     * Ingest High-Throughput Telemetry
     */
    async processTelemetry(deviceId, payload) {
        // 1. Persist Payload
        const telemetry = await IoTTelemetry.create({
            deviceId,
            type: payload.type || 'sensor_reading',
            value: payload.value,
            unit: payload.unit,
            rawPayload: payload
        });

        // 2. Real-time Analysis (Rule Engine)
        await this.analyzeTelemetry(deviceId, payload);

        // 3. Update Device Heartbeat
        await IoTDevice.findOneAndUpdate(
            { deviceId },
            {
                lastSeen: new Date(),
                status: 'online',
                'metadata.lastValue': payload.value
            }
        );

        return telemetry;
    }

    /**
     * Rule Engine: The "Brain" separating noise from signal.
     */
    async analyzeTelemetry(deviceId, payload) {
        // Rule: Critical Temperature (Golden Farm Spec)
        if (payload.type === 'temperature' && payload.value > 30) {
            await this.triggerAlert(deviceId, {
                type: 'alert',
                severity: 'critical',
                message: `Critical Temp: ${payload.value}°C exceeds threshold (30°C)`,
                details: { value: payload.value, threshold: 30 }
            });
        }

        // Rule: Critical Soil Dryness
        if (payload.type === 'soil_moisture' && payload.value < 20) {
            await this.triggerAlert(deviceId, {
                type: 'alert',
                severity: 'warning',
                message: `Soil Dryness Warning: ${payload.value}%`,
                details: { value: payload.value, threshold: 20 }
            });
        }
    }

    async triggerAlert(deviceId, alertData) {
        const eventId = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        await IoTEvent.create({
            eventId,
            deviceId,
            eventType: alertData.type || 'alert',
            severity: alertData.severity || 'info',
            message: alertData.message,
            details: alertData.details,
            status: 'new'
        });

        // The ChangeStreamService will automatically pick this up 
        // and broadcast 'IOT_CRITICAL_EVENT' to the dashboard.
    }

    async registerDevice(data, userId) {
        const device = await IoTDevice.create({
            ...data,
            owner: userId,
            status: 'offline'
        });
        return device;
    }

    async getIoTStats() {
        const total = await IoTDevice.countDocuments();
        const online = await IoTDevice.countDocuments({ status: 'online' });
        const criticalAlerts = await IoTEvent.countDocuments({ status: 'new', severity: 'critical' });

        return {
            totalDevices: total,
            onlineDevices: online,
            utilization: Math.round((online / (total || 1)) * 100),
            criticalAlerts,
            healthStatus: criticalAlerts > 0 ? 'ATTENTION_REQUIRED' : 'OPTIMAL'
        };
    }
}

export default new IoTService();
