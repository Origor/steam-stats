import { useState, useEffect } from 'react';
import { MOCK_USER, MOCK_GAMES, MOCK_ACHIEVEMENTS } from '../mockData';
import { getPlayerSummaries, getOwnedGames, getPlayerAchievements, getBackendSteamData } from '../services/steamApi';

export function useSteamData({ steamId, useProxy }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [gamesData, setGamesData] = useState(null);
    const [isDemo, setIsDemo] = useState(true);
    const [achievements, setAchievements] = useState({});
    const [loadingAchId, setLoadingAchId] = useState(null);

    useEffect(() => {
        loadDemoData();
    }, []);

    const loadDemoData = () => {
        setLoading(true);
        setTimeout(() => {
            setUserData(MOCK_USER);
            setGamesData(MOCK_GAMES);
            setLoading(false);
            setIsDemo(true);
            setError('');
            setAchievements({});
        }, 800);
    };

    const fetchData = async () => {
        // API Key is now handled by backend

        // Note: Backend handles API key for player/games data, but we might still need key for achievements
        // if generic 'fetchAchievements' still runs client-side.


        // Use provided key, or fallback to dev env var if in dev mode
        const effectiveKey = steamApiKey || (import.meta.env.DEV ? import.meta.env.VITE_DEV_STEAM_API_KEY : '');

        // Note: Backend handles API key for player/games data, but we might still need key for achievements
        // if generic 'fetchAchievements' still runs client-side.

        if (!steamId) {
            setError("Please provide a Steam ID.");
            return;
        }

        setLoading(true);
        setError('');
        setIsDemo(false);
        setAchievements({});

        try {
            // Use Backend
            const backendData = await getBackendSteamData(steamId);

            const player = backendData.player_summary?.response?.players?.[0];
            if (!player) throw new Error("User not found or profile is private (Backend).");

            const games = backendData.owned_games?.response?.games;
            // Games might be empty/null if private, but backend should return structure

            setUserData(player);
            setGamesData(games || []); // Backend returns structure, games list might be missing

        } catch (err) {
            console.error(err);
            setError(`Failed to fetch data from backend: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAchievements = async (appid) => {
        if (achievements[appid] || isDemo) {
            if (isDemo && !achievements[appid]) {
                setAchievements(prev => ({ ...prev, [appid]: MOCK_ACHIEVEMENTS }));
            }
            return;
        }
        setLoadingAchId(appid);
        try {
            const json = await getPlayerAchievements(null, steamId, appid); // API Key not needed for backend call
            const unlocked = json.playerstats?.achievements?.filter(a => a.achieved === 1) || [];
            setAchievements(prev => ({ ...prev, [appid]: unlocked }));
        } catch (err) {
            console.log("Achievement fetch failed:", err);
            setAchievements(prev => ({ ...prev, [appid]: [] }));
        } finally {
            setLoadingAchId(prev => (prev === appid ? null : prev));
        }
    };

    return {
        loading,
        error,
        userData,
        gamesData,
        isDemo,
        achievements,
        loadingAchId,
        loadDemoData,
        fetchData,
        fetchAchievements,
        setError // Exporting setError in case needed, or for cleanup
    };
}
