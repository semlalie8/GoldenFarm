import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Utility to trigger n8n workflows based on CRM events.
 */
export const triggerAutomation = async (event, data) => {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
        console.warn('Automation trigger skipped: N8N_WEBHOOK_URL not configured.');
        return;
    }

    try {
        console.log(`[Automation] Triggering event: ${event}`);
        const response = await axios.post(n8nWebhookUrl, {
            event,
            timestamp: new Date().toISOString(),
            payload: data
        }, {
            headers: {
                'X-CRM-Event': event,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error(`[Automation Error] Failed to trigger ${event}:`, error.message);
        // Log to CRM Audit trail if possible
        return null;
    }
};
