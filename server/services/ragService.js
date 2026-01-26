import aiManager from './aiManager.js';
import VectorMemory from '../models/vectorMemoryModel.js';

/**
 * RAG Service handles vector indexing and retrieval.
 * "AI agents must never rely on memory alone."
 */
class RAGService {
    /**
     * Index text data into the persistent vector store.
     */
    async indexDocument(text, metadata = {}) {
        try {
            console.log(`[RAG] Indexing narrative context...`);
            const embedding = await aiManager.getEmbeddings(text);

            await VectorMemory.create({
                content: text,
                embedding,
                metadata
            });

            return true;
        } catch (error) {
            console.error('[RAG Index Error]', error);
            return false;
        }
    }

    /**
     * Retrieve relevant context for a query.
     */
    async retrieveContext(query, filter = {}, limit = 3) {
        try {
            console.log(`[RAG] Searching memory for: "${query}"`);
            const queryEmbedding = await aiManager.getEmbeddings(query);

            // Fetch all relevant memories (in a production scale, we'd use Atlas Vector Search)
            // For this phase, we fetch the last 100 entries and rank them
            const memories = await VectorMemory.find(filter)
                .sort({ createdAt: -1 })
                .limit(100);

            if (memories.length === 0) return "";

            const scored = memories.map(mem => ({
                content: mem.content,
                score: this._cosineSimilarity(queryEmbedding, mem.embedding)
            }));

            const results = scored
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return results.map(r => r.content).join('\n---\n');
        } catch (error) {
            console.error('[RAG Retrieval Error]', error);
            return "";
        }
    }

    _cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

export default new RAGService();

