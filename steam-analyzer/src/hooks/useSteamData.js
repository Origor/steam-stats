import { useState, useEffect } from 'react';
import { MOCK_USER, MOCK_GAMES, MOCK_ACHIEVEMENTS } from '../mockData';

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
            const proxyUrl = useProxy ? 'https://api.allorigins.win/get?url=' : '';
            const fetchWithProxy = async (url) => {
                const fullUrl = proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;
                const res = await fetch(fullUrl);
                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                const json = await res.json();
                return proxyUrl ? JSON.parse(json.contents) : json;
            };

            const userUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamApiKey}&steamids=${steamId}`;
            const userRes = await fetchWithProxy(userUrl);
            const player = userRes.response?.players?.[0];
            if (!player) throw new Error("User not found or profile is private.");

            const gamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
            const gamesRes = await fetchWithProxy(gamesUrl);
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
            const proxyUrl = useProxy ? 'https://api.allorigins.win/get?url=' : '';
            const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${appid}&key=${steamApiKey}&steamid=${steamId}`;
            const fullUrl = proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;
            const res = await fetch(fullUrl);
            if (!res.ok) throw new Error("No achievements found or private");
            const json = await res.json();
            const proxyJson = proxyUrl ? JSON.parse(json.contents) : json;
            const unlocked = proxyJson.playerstats?.achievements?.filter(a => a.achieved === 1) || [];
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
