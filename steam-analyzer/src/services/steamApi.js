const PROXY_BASE = 'https://api.allorigins.win/get?url=';
const STEAM_BASE = 'https://api.steampowered.com';

const fetchWithProxy = async (url, useProxy) => {
    const fullUrl = useProxy ? `${PROXY_BASE}${encodeURIComponent(url)}` : url;
    try {
        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const json = await res.json();
        const data = useProxy ? JSON.parse(json.contents) : json;
        if (!data) throw new Error("Received empty data from API");
        return data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw new Error(error.message || "Failed to fetch data");
    }
};

export const getPlayerSummaries = async (apiKey, steamId, useProxy = true) => {
    const url = `${STEAM_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;
    return fetchWithProxy(url, useProxy);
};

export const getOwnedGames = async (apiKey, steamId, useProxy = true) => {
    const url = `${STEAM_BASE}/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
    return fetchWithProxy(url, useProxy);
};

export const getPlayerAchievements = async (apiKey, steamId, appid, useProxy = true) => {
    const url = `${STEAM_BASE}/ISteamUserStats/GetPlayerAchievements/v1/?appid=${appid}&key=${apiKey}&steamid=${steamId}`;
    return fetchWithProxy(url, useProxy);
};

const BACKEND_URL = 'http://localhost:3000/api/steam';

export const getBackendSteamData = async (steamId) => {
    try {
        const res = await fetch(`${BACKEND_URL}/user/${steamId}`);
        if (!res.ok) throw new Error(`Backend Error: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Backend Fetch Error:", error);
        throw error;
    }
};
