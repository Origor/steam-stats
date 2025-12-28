import { useState, useEffect } from 'react';
import { MOCK_USER, MOCK_GAMES, MOCK_ACHIEVEMENTS } from '../mockData';
import { getPlayerSummaries, getOwnedGames, getPlayerAchievements } from '../services/steamApi';

export function useSteamData({ steamApiKey, steamId, useProxy }) {
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
        if (!steamApiKey || !steamId) {
            setError("Please provide both an API Key and Steam ID.");
            return;
        }
        setLoading(true);
        setError('');
        setIsDemo(false);
        setAchievements({});

        try {
            const userRes = await getPlayerSummaries(steamApiKey, steamId, useProxy);
            const player = userRes.response?.players?.[0];
            if (!player) throw new Error("User not found or profile is private.");

            const gamesRes = await getOwnedGames(steamApiKey, steamId, useProxy);
            const games = gamesRes.response?.games;
            if (!games) throw new Error("Could not fetch games. Is the profile public?");

            setUserData(player);
            setGamesData(games);
        } catch (err) {
            console.error(err);
            setError(`Failed to fetch data: ${err.message}.`);
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
            const json = await getPlayerAchievements(steamApiKey, steamId, appid, useProxy);
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
