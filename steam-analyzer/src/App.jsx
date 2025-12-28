import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Trophy, 
  Clock, 
  AlertTriangle, 
  Gamepad2, 
  BarChart2, 
  PieChart, 
  User, 
  RefreshCw,
  Info,
  ExternalLink,
  Sparkles,
  Brain,
  MessageSquare,
  Loader2,
  Database,
  Calculator
} from 'lucide-react';

// --- GEMINI API SETUP ---
// Access the API key from the .env file using Vite's specific env object
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || ""; 
// const googleApiKey = "";

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_USER = {
  steamid: '76561198000000000',
  personaname: 'DemoGamer_99',
  avatarfull: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  profileurl: 'https://steamcommunity.com/',
  timecreated: 1262304000 // Jan 1 2010
};

const MOCK_GAMES = [
  { appid: 730, name: 'Counter-Strike: Global Offensive', playtime_forever: 85000, img_icon_url: '69f7ebe2735c366c65c0b33dae00e12dc40edbe4' },
  { appid: 570, name: 'Dota 2', playtime_forever: 120000, img_icon_url: '0bf11a9e2e7760d3fe72db086629305601a337fb' },
  { appid: 440, name: 'Team Fortress 2', playtime_forever: 4500, img_icon_url: 'e3f595a92552da3d664ad00277fad2107345f743' },
  { appid: 271590, name: 'Grand Theft Auto V', playtime_forever: 6200, img_icon_url: '1e7c62a87556c52d8b802a433f48a1c6a8585e51' },
  { appid: 252490, name: 'Rust', playtime_forever: 12000, img_icon_url: '82216e53c44862211624f1c7136015f5c8899880' },
  { appid: 292030, name: 'The Witcher 3: Wild Hunt', playtime_forever: 8000, img_icon_url: '96940d9d690a7862215c26914561845c083693e5' },
  { appid: 105600, name: 'Terraria', playtime_forever: 3400, img_icon_url: '858961e95fdb869f7a6295822081597a9b0c58e5' },
  { appid: 4000, name: 'Garry\'s Mod', playtime_forever: 1500, img_icon_url: '4a6f25cfa2426445d0d9d6e233408de0237e7352' },
  { appid: 227300, name: 'Euro Truck Simulator 2', playtime_forever: 900, img_icon_url: '197931327170e70417934272828b122026852e18' },
  { appid: 250900, name: 'The Binding of Isaac: Rebirth', playtime_forever: 2800, img_icon_url: '21398c7608244e43e2f5b66d43236e65126831cb' },
  { appid: 10, name: 'Counter-Strike', playtime_forever: 30, img_icon_url: '2e478fc6874d06ae5baf0d147f6f21203291aa02' },
  { appid: 70, name: 'Half-Life', playtime_forever: 400, img_icon_url: '958b7596d11f6d900b73010b991ad34f8a6198f3' },
  { appid: 620, name: 'Portal 2', playtime_forever: 600, img_icon_url: '2e478fc6874d06ae5baf0d147f6f21203291aa02' },
  { appid: 892970, name: 'Valheim', playtime_forever: 2100, img_icon_url: '958b7596d11f6d900b73010b991ad34f8a6198f3' },
  { appid: 1, name: 'Unplayed Game A', playtime_forever: 0, img_icon_url: '' },
  { appid: 2, name: 'Unplayed Game B', playtime_forever: 0, img_icon_url: '' },
  { appid: 3, name: 'Unplayed Game C', playtime_forever: 0, img_icon_url: '' },
  { appid: 4, name: 'Bad Game D', playtime_forever: 15, img_icon_url: '' },
  { appid: 5, name: 'Indie Gem E', playtime_forever: 120, img_icon_url: '' },
  { appid: 6, name: 'Simulation F', playtime_forever: 0, img_icon_url: '' },
  { appid: 7, name: 'RPG G', playtime_forever: 45, img_icon_url: '' },
  { appid: 8, name: 'Shooter H', playtime_forever: 0, img_icon_url: '' },
];

// --- UTILITY FUNCTIONS ---
const formatHours = (minutes) => (minutes / 60).toFixed(1);
const formatNumber = (num) => new Intl.NumberFormat().format(num);

const openSteamDB = (appid) => {
  window.open(`https://steamdb.info/app/${appid}/`, '_blank');
};

const openSteamStore = (appid) => {
  window.open(`https://store.steampowered.com/app/${appid}/`, '_blank');
};

// --- COMPONENTS ---

// Simple Markdown Parser for AI responses
const SimpleMarkdown = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-1 text-slate-600">
      {text.split('\n').map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-2" />;
        
        // Check for bullet points
        const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;

        // Check for headers (basic # support)
        const isHeader = line.trim().startsWith('##');
        const headerText = isHeader ? line.trim().replace(/^#+\s*/, '') : cleanLine;

        // Process bold text **bold**
        const parts = headerText.split(/(\*\*.*?\*\*)/g);

        if (isHeader) {
             return <h4 key={i} className="font-bold text-slate-800 mt-2 mb-1">{headerText.replace(/\*\*/g, '')}</h4>
        }

        return (
          <div key={i} className={`${isBullet ? 'pl-4 flex items-start' : ''}`}>
            {isBullet && <span className="mr-2 text-indigo-400">•</span>}
            <p className="inline leading-relaxed">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        {subtext && <p className="text-slate-500 text-xs mt-2 font-medium">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass.bg} bg-opacity-15`}>
        <Icon className={`w-6 h-6 ${colorClass.text}`} />
      </div>
    </div>
  </div>
);

const AICard = ({ title, result, loading, onClick, icon: Icon, buttonText }) => (
  <div className="bg-white border border-indigo-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    {/* Soft gradient background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>

      <div className="min-h-[100px] mb-4">
        {loading ? (
          <div className="flex items-center gap-2 text-indigo-400 animate-pulse mt-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Brewing insights...</span>
          </div>
        ) : result ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <SimpleMarkdown text={result} />
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">
            Ready to analyze your library. Click below to start.
          </p>
        )}
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <Sparkles className="w-4 h-4" />
        )}
        {buttonText}
      </button>
    </div>
  </div>
);

const CustomBarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div className="flex flex-col gap-4 w-full">
      {data.map((item, idx) => (
        <div key={idx} className="w-full group">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-700 font-semibold truncate w-3/4">{item.label}</span>
            <span className="text-slate-400 font-mono text-xs">{formatNumber(item.value)}h</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-indigo-300 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400"
              style={{ width: `${(item.value / maxVal) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CustomDonutChart = ({ data }) => {
  const size = 200;
  const strokeWidth = 20;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = 0;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-48 h-48">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -currentAngle;
            currentAngle += (item.value / total) * circumference;
            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 hover:opacity-80"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none rotate-90">
            <span className="text-3xl font-bold text-slate-700">{data.length}</span>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Types</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
            <span className="text-slate-600 font-medium">{item.label}</span>
            <span className="text-slate-400">({Math.round((item.value/total)*100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function SteamAnalyzer() {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [gamesData, setGamesData] = useState(null);
  const [isDemo, setIsDemo] = useState(true);
  const [useProxy, setUseProxy] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI State
  const [aiProfile, setAiProfile] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiValuation, setAiValuation] = useState('');
  const [aiLoadingType, setAiLoadingType] = useState(null); 

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
      setAiProfile('');
      setAiRecommendation('');
      setAiValuation('');
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
    setAiProfile('');
    setAiRecommendation('');
    setAiValuation('');

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
      setError(`Failed to fetch data: ${err.message}. Ensure your API Key is valid and your Steam Profile "Game Details" are set to Public.`);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!gamesData) return null;

    const totalGames = gamesData.length;
    const totalMinutes = gamesData.reduce((acc, game) => acc + game.playtime_forever, 0);
    const totalHours = totalMinutes / 60;
    
    const unplayed = gamesData.filter(g => g.playtime_forever < 60);
    const played = gamesData.filter(g => g.playtime_forever >= 60);
    const shamePercentage = ((unplayed.length / totalGames) * 100).toFixed(1);

    const sortedGames = [...gamesData].sort((a, b) => b.playtime_forever - a.playtime_forever);
    const top5 = sortedGames.slice(0, 5).map(g => ({
      label: g.name,
      value: Math.round(g.playtime_forever / 60)
    }));

    // Pastel Chart Colors
    const distData = [
      { label: 'Unplayed (< 1h)', value: 0, color: '#fca5a5' }, // Red-300
      { label: 'Casual (1-10h)', value: 0, color: '#fcd34d' },  // Amber-300
      { label: 'Regular (10-100h)', value: 0, color: '#93c5fd' }, // Blue-300
      { label: 'Addict (100h+)', value: 0, color: '#6ee7b7' }   // Emerald-300
    ];

    gamesData.forEach(g => {
      const h = g.playtime_forever / 60;
      if (h < 1) distData[0].value++;
      else if (h < 10) distData[1].value++;
      else if (h < 100) distData[2].value++;
      else distData[3].value++;
    });

    const activeDistData = distData.filter(d => d.value > 0);

    return {
      totalGames,
      totalHours: Math.round(totalHours),
      shameCount: unplayed.length,
      shamePercentage,
      averagePlaytime: (totalHours / (played.length || 1)).toFixed(1),
      top5,
      distData: activeDistData,
      sortedGames,
      unplayedGames: unplayed
    };
  }, [gamesData]);

  const filteredGames = useMemo(() => {
    if (!gamesData) return [];
    return [...gamesData]
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [gamesData, searchTerm]);

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Failed to contact the AI Oracle. Please try again.";
    }
  };

  const generateGamerProfile = async () => {
    if (!stats) return;
    setAiLoadingType('profile');
    
    const topGamesList = stats.top5.map(g => `${g.label} (${g.value}h)`).join(', ');
    const shameStat = `${stats.shameCount} unplayed games (${stats.shamePercentage}%)`;
    
    const prompt = `
      Analyze this Steam gamer based on their stats:
      Top Games: ${topGamesList}
      Pile of Shame: ${shameStat}
      Total Hours: ${stats.totalHours}

      Task: Create a funny, witty "Gamer Archetype" title for them (e.g. "The Cozy Collector", "The Achievement Hunter") 
      and a 2-3 sentence psychological profile of their gaming habits. 
      Format the output with the title in bold (surrounded by double asterisks).
    `;

    const result = await callGemini(prompt);
    setAiProfile(result);
    setAiLoadingType(null);
  };

  const suggestBacklogGame = async () => {
    if (!stats) return;
    setAiLoadingType('recommendation');

    const topGamesList = stats.top5.map(g => g.label).join(', ');
    const unplayedSample = stats.unplayedGames
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .map(g => g.name)
      .join(', ');

    const prompt = `
      This Steam user loves playing: ${topGamesList}.
      However, they own these games but have NEVER played them (0 hours): ${unplayedSample}.

      Task: Recommend exactly ONE game from the unplayed list that they should start next. 
      Explain why they would like it based on their favorite games. Keep it short and encouraging. 
      Use bullet points if listing reasons.
    `;

    const result = await callGemini(prompt);
    setAiRecommendation(result);
    setAiLoadingType(null);
  };

  const estimateAccountValue = async () => {
    if (!stats) return;
    setAiLoadingType('valuation');

    const gamesList = stats.sortedGames.slice(0, 30).map(g => g.name).join(', ');

    const prompt = `
      I have a list of Steam games: ${gamesList}.
      
      Task: Act as a "SteamDB Simulator". 
      1. Estimate the approximate total store value of these specific games in USD (current full price, not sale price).
      2. Give an estimated average "Metacritic" or "Steam Review" score for this collection (e.g., 85/100).
      3. Provide a brief 1-sentence financial summary.
      
      Format the output with bold headings (double asterisks) for each section.
    `;

    const result = await callGemini(prompt);
    setAiValuation(result);
    setAiLoadingType(null);
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 pb-20">
      {/* Header / Config */}
      <div className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-500">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Steam Insight</h1>
                <p className="text-slate-500 text-xs font-medium">Cozy Profile Analytics</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {isDemo ? (
                 <div className="flex items-center bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-indigo-600 text-xs font-medium">
                   <Info className="w-3.5 h-3.5 mr-1.5" />
                   Viewing Demo Mode
                 </div>
              ) : (
                <div className="flex items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-emerald-600 text-xs font-medium">
                   <User className="w-3.5 h-3.5 mr-1.5" />
                   Live Data
                </div>
              )}
              
              {/* STEAMDB LINK */}
              {userData && (
                <a 
                  href={`https://steamdb.info/calculator/${userData.steamid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors group"
                >
                  <Database className="w-3.5 h-3.5 mr-1.5 text-slate-400 group-hover:text-slate-600" />
                  SteamDB
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-40" />
                </a>
              )}

              <button 
                onClick={loadDemoData}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="mt-4 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none text-slate-500 hover:text-indigo-500 transition-colors">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Search className="w-4 h-4" /> Fetch Real Steam Data
                </span>
                <span className="group-open:rotate-180 transition-transform text-slate-400">▼</span>
              </summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Steam API Key</label>
                  <input 
                    type="password" 
                    value={steamApiKey} 
                    onChange={(e) => setSteamApiKey(e.target.value)}
                    placeholder="E.g. 123456789ABC..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all"
                  />
                  <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium">
                    Get API Key <ExternalLink className="w-3 h-3"/>
                  </a>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Steam ID (64-bit)</label>
                  <input 
                    type="text" 
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    placeholder="E.g. 7656119800000..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all"
                  />
                  <a href="https://steamid.io/" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium">
                    Find my ID <ExternalLink className="w-3 h-3"/>
                  </a>
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
                   <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="proxy" 
                        checked={useProxy} 
                        onChange={(e) => setUseProxy(e.target.checked)}
                        className="rounded bg-white border-slate-300 text-indigo-500 focus:ring-indigo-200"
                      />
                      <label htmlFor="proxy" className="text-sm text-slate-500 font-medium">Use CORS Proxy (Required for browser-only)</label>
                   </div>
                   <button 
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md shadow-indigo-200 text-sm"
                   >
                     {loading ? 'Fetching...' : 'Analyze Profile'}
                   </button>
                </div>
                {error && (
                  <div className="md:col-span-2 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2 font-medium">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!userData || !stats ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-10 h-10 animate-spin mb-4 text-indigo-300" />
            <p className="font-medium">Waiting for data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* User Profile Banner */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-orange-200/50">
              <div className="relative">
                <img 
                  src={userData.avatarfull} 
                  alt={userData.personaname} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${userData.personastate !== 0 ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{userData.personaname}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-slate-500 mt-2">
                  <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{userData.steamid}</span>
                  {userData.loccountrycode && (
                     <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase">{userData.loccountrycode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Command Center */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AICard 
                title="Gamer Profiler"
                icon={Brain}
                result={aiProfile}
                loading={aiLoadingType === 'profile'}
                onClick={generateGamerProfile}
                buttonText="Analyze Personality ✨"
              />
              <AICard 
                title="Account Appraiser"
                icon={Calculator}
                result={aiValuation}
                loading={aiLoadingType === 'valuation'}
                onClick={estimateAccountValue}
                buttonText="Estimate Value (AI) 💰"
              />
              <AICard 
                title="Backlog Recommender"
                icon={MessageSquare}
                result={aiRecommendation}
                loading={aiLoadingType === 'recommendation'}
                onClick={suggestBacklogGame}
                buttonText="Suggest Next Game ✨"
              />
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Playtime" 
                value={`${formatNumber(stats.totalHours)}h`} 
                subtext={`${((stats.totalHours / 24) / 365).toFixed(1)} years total`}
                icon={Clock}
                colorClass={{bg: 'bg-blue-100', text: 'text-blue-500'}}
              />
              <StatCard 
                title="Library Size" 
                value={stats.totalGames} 
                subtext="Games owned"
                icon={Gamepad2}
                colorClass={{bg: 'bg-purple-100', text: 'text-purple-500'}}
              />
              <StatCard 
                title="Pile of Shame" 
                value={`${stats.shamePercentage}%`} 
                subtext={`${stats.shameCount} unplayed games`}
                icon={AlertTriangle}
                colorClass={{bg: 'bg-rose-100', text: 'text-rose-500'}}
              />
              <StatCard 
                title="Avg. Session" 
                value={`${stats.averagePlaytime}h`} 
                subtext="Per played game"
                icon={Trophy}
                colorClass={{bg: 'bg-emerald-100', text: 'text-emerald-500'}}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top 5 Games */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                    Top 5 Most Played
                  </h3>
                </div>
                <CustomBarChart data={stats.top5} />
              </div>

              {/* Playtime Distribution */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Library Habits
                  </h3>
                </div>
                <CustomDonutChart data={stats.distData} />
              </div>
            </div>

            {/* Detailed Game Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Full Library</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search games..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 w-full sm:w-64 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0 font-bold tracking-wider">
                    <tr>
                      <th className="p-4">Game</th>
                      <th className="p-4 text-right">Total Hours</th>
                      <th className="p-4 text-right hidden sm:table-cell">Playtime (Min)</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGames.length > 0 ? (
                      filteredGames.map((game) => (
                        <tr key={game.appid} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden shadow-sm">
                                {game.img_icon_url ? (
                                    <img src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">?</div>
                                )}
                            </div>
                            <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate max-w-[150px] sm:max-w-xs">{game.name}</span>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-600 font-medium">
                            {game.playtime_forever > 0 ? formatHours(game.playtime_forever) : '-'}
                          </td>
                          <td className="p-4 text-right text-slate-400 text-sm hidden sm:table-cell">
                            {formatNumber(game.playtime_forever)}
                          </td>
                          <td className="p-4 text-center">
                            {game.playtime_forever === 0 ? (
                              <span className="inline-block px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">Unplayed</span>
                            ) : game.playtime_forever > 6000 ? (
                              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">Favorite</span>
                            ) : (
                                <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">Played</span>
                            )}
                          </td>
                          <td className="p-4 flex items-center justify-center gap-2">
                             <button 
                                onClick={() => openSteamStore(game.appid)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-500 transition-colors"
                                title="View on Steam Store"
                             >
                               <Gamepad2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => openSteamDB(game.appid)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors"
                                title="View on SteamDB"
                             >
                               <Database className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400 italic">
                          No games found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}