import asyncHandler from 'express-async-handler';
import marketService from '../services/marketService.js';
import aiManager from '../services/aiManager.js';

/**
 * @desc    Get Market Synthesis (Phase 5: Market Intelligence)
 * @route   GET /api/market/synthesis
 */
export const getMarketSynthesis = asyncHandler(async (req, res) => {
    const { category } = req.query;

    // 1. Fetch Structural Data
    const [benchmarkData, forex, sentiment] = await Promise.all([
        marketService.getBenchmark(category === 'OLIVES' ? 'OLIVE_OIL' : 'WHEAT'),
        marketService.getForexRate("USD", "MAD"),
        marketService.getMarketSentiment(category || 'AGRICULTURE')
    ]);

    // 2. Generate AI Futurist Analysis
    const prompt = `
        As a Market Futurist for GoldenFarm, synthesize the following data:
        Market Sentiment: ${JSON.stringify(sentiment)}
        FX Rate (USD to MAD): ${forex.rate}
        Benchmark Core: ${JSON.stringify(benchmarkData)}

        Provide a 3-sentence predictive analysis regarding the profitability of agricultural investments in this sector over the next fiscal quarter.
        Identify one 'Black Swan' risk and one 'Golden Opportunity'.
        Format as JSON: { "analysis": "...", "risk": "...", "opportunity": "...", "outlook": "Bullish/Bearish" }
    `;

    const aiAnalysis = await aiManager.getCompletion({
        prompt,
        systemPrompt: "You are a high-level Financial Market Strategist specializing in Agri-Tech and Emerging Markets.",
        temperature: 0.3
    });

    let synthesis = {
        data: { benchmarkData, forex, sentiment },
        ai_insight: {}
    };

    try {
        synthesis.ai_insight = JSON.parse(aiAnalysis);
    } catch (e) {
        synthesis.ai_insight = { analysis: aiAnalysis, status: "Raw Output" };
    }

    res.json(synthesis);
});

/**
 * @desc    Get Top Commodity Movers
 * @route   GET /api/market/movers
 */
export const getMarketMovers = asyncHandler(async (req, res) => {
    const symbols = ['CORN', 'WHEAT', 'OLIVE_OIL', 'ARGAN_OIL'];
    const movers = symbols.map(s => {
        const data = marketService.getMockPrice(s);
        return { symbol: s, ...data };
    });

    res.json(movers);
});
