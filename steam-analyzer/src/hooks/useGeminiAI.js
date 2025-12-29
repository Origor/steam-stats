import { useState } from 'react';
import { generateAIContent } from '../services/steamApi';

export function useGeminiAI() {
    // googleApiKey is no longer needed in frontend
    const [aiProfile, setAiProfile] = useState('');
    const [aiRecommendation, setAiRecommendation] = useState('');
    const [aiValuation, setAiValuation] = useState('');
    const [aiLoadingType, setAiLoadingType] = useState(null);

    const callGemini = async (prompt) => {
        try {
            const data = await generateAIContent(prompt);
            // Backend proxies the response from Google, which has structure:
            // { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights generated.";
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Failed to contact the AI Oracle. Please try again.";
        }
    };

    const generateGamerProfile = async (stats) => {
        if (!stats) return;
        setAiLoadingType('profile');
        const topGamesList = stats.top5.map(g => `${g.label} (${g.value}h)`).join(', ');
        const shameStat = `${stats.shameCount} unplayed games (${stats.shamePercentage}%)`;
        const prompt = `Analyze this Steam gamer based on their stats: Top Games: ${topGamesList}. Pile of Shame: ${shameStat}. Total Hours: ${stats.totalHours}. Task: Create a funny, witty "Gamer Archetype" title for them (e.g. "The Cozy Collector", "The Achievement Hunter") and a 2-3 sentence psychological profile of their gaming habits. Format the output with the title in bold (surrounded by double asterisks).`;
        const result = await callGemini(prompt);
        setAiProfile(result);
        setAiLoadingType(null);
    };

    const suggestBacklogGame = async (stats) => {
        if (!stats) return;
        setAiLoadingType('recommendation');
        const topGamesList = stats.top5.map(g => g.label).join(', ');
        const unplayedSample = stats.unplayedGames.sort(() => 0.5 - Math.random()).slice(0, 20).map(g => g.name).join(', ');
        const prompt = `This Steam user loves playing: ${topGamesList}. However, they own these games but have NEVER played them (0 hours): ${unplayedSample}. Task: Recommend exactly ONE game from the unplayed list that they should start next. Explain why they would like it based on their favorite games. Keep it short and encouraging. Use bullet points if listing reasons.`;
        const result = await callGemini(prompt);
        setAiRecommendation(result);
        setAiLoadingType(null);
    };

    const estimateAccountValue = async (stats) => {
        if (!stats) return;
        setAiLoadingType('valuation');
        const gamesList = stats.sortedGames.slice(0, 30).map(g => g.name).join(', ');
        const prompt = `I have a list of Steam games: ${gamesList}. Task: Act as a "SteamDB Simulator". 1. Estimate the approximate total store value of these specific games in USD (current full price, not sale price). 2. Give an estimated average "Metacritic" or "Steam Review" score for this collection (e.g. 85/100). 3. Provide a brief 1-sentence financial summary. Format the output with bold headings (double asterisks) for each section.`;
        const result = await callGemini(prompt);
        setAiValuation(result);
        setAiLoadingType(null);
    };

    return {
        aiProfile,
        aiRecommendation,
        aiValuation,
        aiLoadingType,
        generateGamerProfile,
        suggestBacklogGame,
        estimateAccountValue,
        setAiProfile,
        setAiRecommendation,
        setAiValuation
    };
}
