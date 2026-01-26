import axios from 'axios';
import dotenv from 'dotenv';
import CircuitBreaker from '../utils/resiliency.js';

dotenv.config();

/**
 * AI Manager handles multi-model selection and abstraction.
 * Focus: Supporting Data Science and Statistics using Local LLMs (Ollama).
 */
class AIManager {
    constructor() {
        console.log('[AI Manager] Initializing in Local-First mode (Ollama).');
        this.llmBreaker = new CircuitBreaker('Ollama-LLM', { failureThreshold: 5, resetTimeout: 30000 });
        this.embedBreaker = new CircuitBreaker('Ollama-Embed', { failureThreshold: 5, resetTimeout: 30000 });
        this.visionBreaker = new CircuitBreaker('Ollama-Vision', { failureThreshold: 3, resetTimeout: 60000 });
    }

    /**
     * Analyze an image using a multi-modal model (e.g., LLaVA)
     */
    async analyzeImage(imageB64, prompt, model = "llava") {
        try {
            return await this.visionBreaker.execute(() =>
                this._callVisionLLM(imageB64, prompt, model)
            );
        } catch (error) {
            console.error(`AI Vision Error:`, error.message);
            return "VISION_OFFLINE: The neural visual cortex is currently overloaded or offline.";
        }
    }

    async _callVisionLLM(imageB64, prompt, model) {
        const url = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

        const payload = {
            model: model || "llava",
            prompt: prompt,
            images: [imageB64.replace(/^data:image\/\w+;base64,/, "")],
            stream: false
        };

        const response = await axios.post(url, payload, { timeout: 90000 });
        return response.data.response;
    }

    async getCompletion(params) {
        const {
            prompt,
            systemPrompt = "You are a Data Science & Statistics assistant. Narrate the provided technical data with precision and accuracy.",
            model = "llama3.2",
            temperature = 0.1,
            maxTokens = 1000
        } = params;

        try {
            return await this.llmBreaker.execute(() =>
                this._callLocalLLM(prompt, systemPrompt, model, temperature, maxTokens)
            );
        } catch (error) {
            console.error(`AI Completion Error:`, error.message);
            // If the circuit is open, return a deterministic fallback
            return "SIGNAL_LOST: The platform's AI synapses are busy or temporarily offline. Please try again soon.";
        }
    }

    async _callLocalLLM(prompt, systemPrompt, model, temperature, maxTokens) {
        const endpoints = [
            process.env.OLLAMA_URL,
            "http://host.docker.internal:11434/api/generate",
            "http://localhost:11434/api/generate"
        ].filter(Boolean);

        const selectedModel = model || "llama3.2";
        const enhancedSystemPrompt = `${systemPrompt}\n\nIMPORTANT: Prioritize statistical accuracy.`;

        const payload = {
            model: selectedModel,
            prompt: `${enhancedSystemPrompt}\n\nUser: ${prompt}\nAssistant:`,
            stream: false,
            options: {
                temperature: temperature,
                num_predict: maxTokens || 500,
            }
        };

        for (const url of endpoints) {
            try {
                const response = await axios.post(url, payload, { timeout: 45000 });
                if (response.data && response.data.response) {
                    return response.data.response;
                }
            } catch (error) {
                console.warn(`[AI Manager] Failed to connect to ${url}: ${error.code || error.message}`);
            }
        }

        throw new Error('All LLM endpoints failed');
    }

    /**
     * Generate high-dimensional embeddings for a text string.
     * Essential for Phase 3 (RAG).
     */
    async getEmbeddings(text, model = "all-minilm") {
        try {
            return await this.embedBreaker.execute(() => this._callEmbeddings(text, model));
        } catch (error) {
            console.warn("[AI Manager] Embedding fallback triggered.");
            const pseudo = new Array(384).fill(0).map((_, i) => Math.sin(text.length * (i + 1)));
            return pseudo;
        }
    }

    async _callEmbeddings(text, model = "all-minilm") {
        const endpoints = [
            process.env.OLLAMA_EMBED_URL,
            "http://host.docker.internal:11434/api/embeddings",
            "http://localhost:11434/api/embeddings"
        ].filter(Boolean);

        const payload = {
            model: model || "all-minilm",
            prompt: text
        };

        for (const url of endpoints) {
            try {
                const response = await axios.post(url, payload, { timeout: 10000 });
                if (response.data && response.data.embedding) {
                    return response.data.embedding;
                }
            } catch (error) {
                // Silently try next endpoint
            }
        }
        throw new Error('All embedding endpoints failed');
    }
}

export default new AIManager();
