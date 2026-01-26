import mongoose from 'mongoose';

const vectorMemorySchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number], // Array of floats from OpenAI/Embeddings API
        required: true
    },
    metadata: {
        source: String, // 'strategic_consensus', 'iot_alert', 'user_feedback'
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        timestamp: { type: Date, default: Date.now }
    },
    tags: [String]
}, {
    timestamps: true
});

// Since standard MongoDB doesn't support vector search natively in the community edition easily (unless using Atlas Vector Search),
// we will implement a basic cosine similarity logic in the service layer for this phase.
const VectorMemory = mongoose.model('VectorMemory', vectorMemorySchema);

export default VectorMemory;
