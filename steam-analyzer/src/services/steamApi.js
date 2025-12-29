const BACKEND_URL = '/api';

// Helper to fetch from backend
const fetchBackend = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, options);
        if (!res.ok) throw new Error(`Backend Error: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Backend Fetch Error (${endpoint}):`, error);
        throw error;
    }
};

export const getPlayerSummaries = async (apiKey, steamId) => {
    // Legacy support or direct use if needed, but preferable to use getBackendSteamData
    // For now, let's keep it but warn or redirect if we want full migration.
    // Given the task, let's stick to what's used in hooks.
    return fetchBackend(`/steam/user/${steamId}`).then(data => data.player_summary);
};

export const getOwnedGames = async (apiKey, steamId) => {
    return fetchBackend(`/steam/user/${steamId}`).then(data => data.owned_games);
};

export const getPlayerAchievements = async (apiKey, steamId, appid) => {
    return fetchBackend(`/steam/user/${steamId}/achievements/${appid}`);
};

export const getBackendSteamData = async (steamId) => {
    return fetchBackend(`/steam/user/${steamId}`);
};

export const generateAIContent = async (prompt) => {
    return fetchBackend('/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
};

