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
  Calculator,
  ImageIcon,
  Calendar,
  Activity,
  ChevronDown,
  ChevronUp,
  Medal
} from 'lucide-react';

// --- GEMINI API CONFIGURATION ---

// 🔴 OPTION 1: FOR PREVIEW (Active)
const googleApiKey = "";

// 🟢 OPTION 2: FOR PRODUCTION / LOCAL (Commented Out)
// const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || "";


// --- MOCK DATA ---
const MOCK_USER = {
  steamid: '76561198000000000',
  personaname: 'DemoGamer_99',
  avatarfull: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  profileurl: 'https://steamcommunity.com/',
  timecreated: 1262304000
};

const MOCK_GAMES = [
  { appid: 730, name: 'Counter-Strike: Global Offensive', playtime_forever: 85000, rtime_last_played: 1700000000, img_icon_url: '69f7ebe2735c366c65c0b33dae00e12dc40edbe4' },
  { appid: 570, name: 'Dota 2', playtime_forever: 120000, rtime_last_played: 1698000000, img_icon_url: '0bf11a9e2e7760d3fe72db086629305601a337fb' },
  { appid: 440, name: 'Team Fortress 2', playtime_forever: 4500, rtime_last_played: 1650000000, img_icon_url: 'e3f595a92552da3d664ad00277fad2107345f743' },
  { appid: 271590, name: 'Grand Theft Auto V', playtime_forever: 100, rtime_last_played: 1680000000, img_icon_url: '1e7c62a87556c52d8b802a433f48a1c6a8585e51' },
  { appid: 252490, name: 'Rust', playtime_forever: 12000, rtime_last_played: 1701000000, img_icon_url: '82216e53c44862211624f1c7136015f5c8899880' },
  { appid: 292030, name: 'The Witcher 3: Wild Hunt', playtime_forever: 8000, rtime_last_played: 1640000000, img_icon_url: '96940d9d690a7862215c26914561845c083693e5' },
  { appid: 105600, name: 'Terraria', playtime_forever: 200, rtime_last_played: 1690000000, img_icon_url: '858961e95fdb869f7a6295822081597a9b0c58e5' },
  { appid: 1, name: 'Unplayed Game A', playtime_forever: 0, rtime_last_played: 0, img_icon_url: '' },
  { appid: 2, name: 'Unplayed Game B', playtime_forever: 0, rtime_last_played: 0, img_icon_url: '' },
];

const MOCK_ACHIEVEMENTS = Array.from({ length: 30 }).map((_, i) => ({
  apiname: `ACHIEVEMENT_${i}`,
  name: `Achievement ${i + 1}`,
  description: "You did something amazing in the game.",
  achieved: 1,
  unlocktime: 1672531200 + (Math.random() * 31536000)
}));

// --- UTILITY FUNCTIONS ---
const formatHours = (minutes) => (minutes / 60).toFixed(1);
const formatNumber = (num) => new Intl.NumberFormat().format(num);
const formatDate = (timestamp) => {
  if (!timestamp) return 'Never';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const openSteamDB = (appid) => window.open(`https://steamdb.info/app/${appid}/`, '_blank', 'noopener,noreferrer');
const openSteamStore = (appid) => window.open(`https://store.steampowered.com/app/${appid}/`, '_blank', 'noopener,noreferrer');

// --- COMPONENTS ---

const ActivityHeatmap = ({ achievements }) => {
  const days = useMemo(() => {
    const today = new Date();
    const d = [];
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      d.push({
        date: date.toISOString().split('T')[0],
        count: 0,
        fullDate: date
      });
    }
    achievements.forEach(ach => {
      if (ach.unlocktime) {
        const dateStr = new Date(ach.unlocktime * 1000).toISOString().split('T')[0];
        const dayEntry = d.find(day => day.date === dateStr);
        if (dayEntry) dayEntry.count += 1;
      }
    });
    return d;
  }, [achievements]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Achievement Activity (Last Year)</h4>
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <span>Less</span>
          <div className="w-2 h-2 bg-slate-100 rounded-sm"></div>
          <div className="w-2 h-2 bg-emerald-200 rounded-sm"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-sm"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-sm"></div>
          <span>More</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-[2px]">
        {days.map((day, i) => {
          let colorClass = "bg-slate-100";
          if (day.count > 0) colorClass = "bg-emerald-200";
          if (day.count > 2) colorClass = "bg-emerald-400";
          if (day.count > 5) colorClass = "bg-emerald-600";
          return (<div key={i} title={`${day.date}: ${day.count} achievements`} className={`w-2 h-2 rounded-sm ${colorClass}`}></div>)
        })}
      </div>
    </div>
  );
};

const SimpleMarkdown = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-1 text-slate-600">
      {text.split('\n').map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-2" />;
        const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;
        const isHeader = line.trim().startsWith('##');
        const headerText = isHeader ? line.trim().replace(/^#+\s*/, '') : cleanLine;
        const parts = headerText.split(/(\*\*.*?\*\*)/g);
        if (isHeader) return <h4 key={i} className="font-bold text-slate-800 mt-2 mb-1">{headerText.replace(/\*\*/g, '')}</h4>
        return (
          <div key={i} className={`${isBullet ? 'pl-4 flex items-start' : ''}`}>
            {isBullet && <span className="mr-2 text-indigo-400">•</span>}
            <p className="inline leading-relaxed">
              {parts.map((part, j) => (part.startsWith('**') && part.endsWith('**') ? <strong key={j} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong> : part))}
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
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><Icon className="w-5 h-5" /></div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="min-h-[100px] mb-4">
        {loading ? (
          <div className="flex items-center gap-2 text-indigo-400 animate-pulse mt-4"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Brewing insights...</span></div>
        ) : result ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm"><SimpleMarkdown text={result} /></div>
        ) : (
          <p className="text-slate-400 text-sm italic">Ready to analyze your library. Click below to start.</p>
        )}
      </div>
      <button onClick={onClick} disabled={loading} className="w-full py-2.5 px-4 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{buttonText}
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
          <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-700 font-semibold truncate w-3/4">{item.label}</span><span className="text-slate-400 font-mono text-xs">{formatNumber(item.value)}h</span></div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-indigo-300 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400" style={{ width: `${(item.value / maxVal) * 100}%` }}></div></div>
        </div>
      ))}
    </div>
  );
};

const CustomDonutChart = ({ data, onCategorySelect, selectedCategory }) => {
  const size = 320;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const visibleFraction = 0.75;
  const visibleCircumference = circumference * visibleFraction;

  let currentAngle = 0;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex items-center justify-center py-4 pl-4"> {/* Added padding left to offset the visual weight */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Chart SVG */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-90 select-none drop-shadow-sm overflow-visible">
          {/* Visual Layer - PURELY VISUAL (pointer-events-none) */}
          {data.map((item, idx) => {
            if (item.value === 0) return null;
            const segmentLength = (item.value / total) * visibleCircumference;
            const strokeDasharray = `${segmentLength} ${circumference}`;
            const strokeDashoffset = -currentAngle;
            const originalAngle = currentAngle; // Store for hit test layer
            currentAngle += segmentLength;

            const isHovered = hoveredIndex === idx;
            const isSelected = selectedCategory === item.id;
            const isDimmed = (hoveredIndex !== null && !isHovered) || (selectedCategory && !isSelected);

            return (
              <circle
                key={`visual-${idx}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={isHovered || isSelected ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-300 ease-out pointer-events-none ${isDimmed ? 'opacity-30' : 'opacity-100'} ${isHovered || isSelected ? 'brightness-110' : ''}`}
              />
            );
          })}

          {/* Interaction Layer - INVISIBLE HIT TARGETS (Reset angle loop) */}
          {(() => {
            let hitAngle = 0;
            return data.map((item, idx) => {
              if (item.value === 0) return null;
              const segmentLength = (item.value / total) * visibleCircumference;
              const strokeDasharray = `${segmentLength} ${circumference}`;
              const strokeDashoffset = -hitAngle;
              hitAngle += segmentLength;

              return (
                <circle
                  key={`hit-${idx}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={strokeWidth + 16} // Stable, wide hit area
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => { e.stopPropagation(); onCategorySelect(item.id); }}
                  className="cursor-pointer transition-none"
                />
              );
            });
          })()}
        </svg>

        {/* Legend positioned in the "Invisible Circle" concept:
            Ideally centered at approx (270, 270) relative to top-left of this 320x320 container.
            We use absolute positioning to place it there.
        */}
        <div
          className="absolute flex flex-col justify-center items-center gap-1 z-10 pointer-events-none"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            bottom: -size * 0.1,
            right: -size * 0.1,
          }}
        >
          {/* Header for Types count - Moved here as requested */}
          <div className="flex items-baseline gap-1 mb-2 border-b-2 border-slate-100 pb-1 px-4">
            <span className="text-2xl font-extrabold text-slate-700">{data.length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Types</span>
          </div>

          {/* Legend Items */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            {data.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const isSelected = selectedCategory === item.id;
              const isDimmed = (hoveredIndex !== null && !isHovered) || (selectedCategory && !isSelected);

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => { e.stopPropagation(); onCategorySelect(item.id); }}
                  className={`flex items-center gap-2 text-xs cursor-pointer transition-all duration-300 px-2 py-0.5 rounded-lg ${isDimmed ? 'opacity-40 blur-[0.5px]' : 'opacity-100'} ${isHovered || isSelected ? 'bg-slate-50 scale-105 shadow-sm ring-1 ring-slate-100' : ''}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm shrink-0 transition-transform ${isHovered || isSelected ? 'scale-125' : ''}`} style={{ backgroundColor: item.color }}></div>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className={`font-bold truncate transition-colors ${isHovered || isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{Math.round((item.value / total) * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameBannerImage = ({ appid, className }) => {
  const [imageSrc, setImageSrc] = useState(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_hero.jpg`);

  return (
    <img
      src={imageSrc}
      alt=""
      className={className}
      onError={() => {
        if (imageSrc.includes('library_hero.jpg')) {
          setImageSrc(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`);
        }
      }}
    />
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

  const [expandedGame, setExpandedGame] = useState(null);
  const [achievements, setAchievements] = useState({});
  const [loadingAchId, setLoadingAchId] = useState(null);

  const [aiProfile, setAiProfile] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiValuation, setAiValuation] = useState('');
  const [aiLoadingType, setAiLoadingType] = useState(null);

  useEffect(() => { loadDemoData(); }, []);

  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      setUserData(MOCK_USER);
      setGamesData(MOCK_GAMES);
      setLoading(false);
      setIsDemo(true);
      setError('');
      setAiProfile(''); setAiRecommendation(''); setAiValuation('');
    }, 800);
  };

  const fetchData = async () => {
    if (!steamApiKey || !steamId) { setError("Please provide both an API Key and Steam ID."); return; }
    setLoading(true); setError(''); setIsDemo(false); setAiProfile(''); setAiRecommendation(''); setAiValuation(''); setAchievements({});

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
    } finally { setLoading(false); }
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

  const handleGameClick = (appid) => {
    if (expandedGame === appid) { setExpandedGame(null); } else { setExpandedGame(appid); fetchAchievements(appid); }
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
    const top5 = sortedGames.slice(0, 5).map(g => ({ label: g.name, value: Math.round(g.playtime_forever / 60) }));
    const distData = [
      { id: 'unplayed', label: 'Unplayed (< 1h)', value: 0, color: '#fca5a5' },
      { id: 'casual', label: 'Casual (1-10h)', value: 0, color: '#fcd34d' },
      { id: 'regular', label: 'Regular (10-100h)', value: 0, color: '#93c5fd' },
      { id: 'addict', label: 'Addict (100h+)', value: 0, color: '#6ee7b7' }
    ];
    gamesData.forEach(g => {
      const h = g.playtime_forever / 60;
      if (h < 1) distData[0].value++; else if (h < 10) distData[1].value++; else if (h < 100) distData[2].value++; else distData[3].value++;
    });
    const activeDistData = distData.filter(d => d.value > 0);
    return { totalGames, totalHours: Math.round(totalHours), shameCount: unplayed.length, shamePercentage, averagePlaytime: (totalHours / (played.length || 1)).toFixed(1), top5, distData: activeDistData, sortedGames, unplayedGames: unplayed };
  }, [gamesData]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredGames = useMemo(() => {
    if (!gamesData) return [];
    let result = [...gamesData]
      .sort((a, b) => b.playtime_forever - a.playtime_forever);

    if (searchTerm) {
      result = result.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory) {
      result = result.filter(g => {
        const h = g.playtime_forever / 60;
        if (selectedCategory === 'unplayed') return h < 1;
        if (selectedCategory === 'casual') return h >= 1 && h < 10;
        if (selectedCategory === 'regular') return h >= 10 && h < 100;
        if (selectedCategory === 'addict') return h >= 100;
        return true;
      });
    }

    return result;
  }, [gamesData, searchTerm, selectedCategory]);

  // AI Functions (Using gemini-2.5-flash-preview-09-2025 as per instruction for text)
  const callGemini = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
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
    const prompt = `Analyze this Steam gamer based on their stats: Top Games: ${topGamesList}. Pile of Shame: ${shameStat}. Total Hours: ${stats.totalHours}. Task: Create a funny, witty "Gamer Archetype" title for them (e.g. "The Cozy Collector", "The Achievement Hunter") and a 2-3 sentence psychological profile of their gaming habits. Format the output with the title in bold (surrounded by double asterisks).`;
    const result = await callGemini(prompt);
    setAiProfile(result); setAiLoadingType(null);
  };

  const suggestBacklogGame = async () => {
    if (!stats) return;
    setAiLoadingType('recommendation');
    const topGamesList = stats.top5.map(g => g.label).join(', ');
    const unplayedSample = stats.unplayedGames.sort(() => 0.5 - Math.random()).slice(0, 20).map(g => g.name).join(', ');
    const prompt = `This Steam user loves playing: ${topGamesList}. However, they own these games but have NEVER played them (0 hours): ${unplayedSample}. Task: Recommend exactly ONE game from the unplayed list that they should start next. Explain why they would like it based on their favorite games. Keep it short and encouraging. Use bullet points if listing reasons.`;
    const result = await callGemini(prompt);
    setAiRecommendation(result); setAiLoadingType(null);
  };

  const estimateAccountValue = async () => {
    if (!stats) return;
    setAiLoadingType('valuation');
    const gamesList = stats.sortedGames.slice(0, 30).map(g => g.name).join(', ');
    const prompt = `I have a list of Steam games: ${gamesList}. Task: Act as a "SteamDB Simulator". 1. Estimate the approximate total store value of these specific games in USD (current full price, not sale price). 2. Give an estimated average "Metacritic" or "Steam Review" score for this collection (e.g., 85/100). 3. Provide a brief 1-sentence financial summary. Format the output with bold headings (double asterisks) for each section.`;
    const result = await callGemini(prompt);
    setAiValuation(result); setAiLoadingType(null);
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 pb-20">
      <div className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-500"><Gamepad2 className="w-6 h-6" /></div>
            <div><h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Steam Insight</h1><p className="text-slate-500 text-xs font-medium">Cozy Profile Analytics</p></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {isDemo ? <div className="flex items-center bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-indigo-600 text-xs font-medium"><Info className="w-3.5 h-3.5 mr-1.5" /> Viewing Demo Mode</div> : <div className="flex items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-emerald-600 text-xs font-medium"><User className="w-3.5 h-3.5 mr-1.5" /> Live Data</div>}
            {userData && (<a href={`https://steamdb.info/calculator/${userData.steamid}/`} target="_blank" rel="noreferrer" className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors group"><Database className="w-3.5 h-3.5 mr-1.5 text-slate-400 group-hover:text-slate-600" /> SteamDB <ExternalLink className="w-3 h-3 ml-1.5 opacity-40" /></a>)}
            <button onClick={loadDemoData} className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-colors">Reset Demo</button>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-orange-50/50 p-3 rounded-xl border border-orange-100 max-w-4xl mx-auto">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none text-slate-500 hover:text-indigo-500 transition-colors">
            <span className="font-bold text-sm flex items-center gap-2"><Search className="w-4 h-4" /> Fetch Real Steam Data</span>
            <span className="group-open:rotate-180 transition-transform text-slate-400">▼</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Steam API Key</label>
              <input type="password" value={steamApiKey} onChange={(e) => setSteamApiKey(e.target.value)} placeholder="E.g. 123456789ABC..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all" />
              <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium">Get API Key <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Steam ID (64-bit)</label>
              <input type="text" value={steamId} onChange={(e) => setSteamId(e.target.value)} placeholder="E.g. 7656119800000..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all" />
              <a href="https://steamid.io/" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium">Find my ID <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2"><input type="checkbox" id="proxy" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} className="rounded bg-white border-slate-300 text-indigo-500 focus:ring-indigo-200" /><label htmlFor="proxy" className="text-sm text-slate-500 font-medium">Use CORS Proxy (Required for browser-only)</label></div>
              <button onClick={fetchData} disabled={loading} className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md shadow-indigo-200 text-sm">{loading ? 'Fetching...' : 'Analyze Profile'}</button>
            </div>
            {error && (<div className="md:col-span-2 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2 font-medium"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>)}
          </div>
        </details>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!userData || !stats ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400"><RefreshCw className="w-10 h-10 animate-spin mb-4 text-indigo-300" /><p className="font-medium">Waiting for data...</p></div>
        ) : (
          <div className="space-y-8">
            {/* User Banner */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-orange-200/50">
              <div className="relative">
                <img src={userData.avatarfull} alt={userData.personaname} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${userData.personastate !== 0 ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{userData.personaname}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-slate-500 mt-2">
                  <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{userData.steamid}</span>
                  {userData.loccountrycode && (<span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase">{userData.loccountrycode}</span>)}
                </div>
              </div>
            </div>

            {/* AI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AICard title="Gamer Profiler" icon={Brain} result={aiProfile} loading={aiLoadingType === 'profile'} onClick={generateGamerProfile} buttonText="Analyze Personality ✨" />
              <AICard title="Account Appraiser" icon={Calculator} result={aiValuation} loading={aiLoadingType === 'valuation'} onClick={estimateAccountValue} buttonText="Estimate Value (AI) 💰" />
              <AICard title="Backlog Recommender" icon={MessageSquare} result={aiRecommendation} loading={aiLoadingType === 'recommendation'} onClick={suggestBacklogGame} buttonText="Suggest Next Game ✨" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Playtime" value={`${formatNumber(stats.totalHours)}h`} subtext={`${((stats.totalHours / 24) / 365).toFixed(1)} years total`} icon={Clock} colorClass={{ bg: 'bg-blue-100', text: 'text-blue-500' }} />
              <StatCard title="Library Size" value={stats.totalGames} subtext="Games owned" icon={Gamepad2} colorClass={{ bg: 'bg-purple-100', text: 'text-purple-500' }} />
              <StatCard title="Pile of Shame" value={`${stats.shamePercentage}%`} subtext={`${stats.shameCount} unplayed games`} icon={AlertTriangle} colorClass={{ bg: 'bg-rose-100', text: 'text-rose-500' }} />
              <StatCard title="Avg. Session" value={`${stats.averagePlaytime}h`} subtext="Per played game" icon={Trophy} colorClass={{ bg: 'bg-emerald-100', text: 'text-emerald-500' }} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-400" />Top 5 Most Played</h3></div><CustomBarChart data={stats.top5} /></div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-400" />Library Habits</h3></div><CustomDonutChart data={stats.distData} onCategorySelect={(id) => setSelectedCategory(prev => prev === id ? null : id)} selectedCategory={selectedCategory} /></div>
            </div>

            {/* Library List */}
            <div className="bg-transparent space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-800 pl-1">Full Library</h3>
                <div className="relative">
                  {selectedCategory && (
                    <span className="absolute -top-7 right-0 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors" onClick={() => setSelectedCategory(null)}>
                      Filter: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ✕
                    </span>
                  )}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 w-full sm:w-64 outline-none transition-all shadow-sm" />
                </div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="flex flex-col rounded-2xl shadow-sm border border-slate-100 bg-white isolate">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-6">Game Name</div>
                    <div className="col-span-2 text-right">Hours</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>

                  {filteredGames.map((game) => {
                    const isExpanded = expandedGame === game.appid;
                    const achs = achievements[game.appid] || [];

                    return (
                      <div key={game.appid} className={`group relative w-full bg-white border-b border-slate-100 last:border-b-0 last:rounded-b-2xl transition-all duration-300 ease-out origin-center cursor-default ${isExpanded ? 'z-30 my-4 rounded-2xl shadow-xl border-slate-200 scale-[1.01]' : 'hover:z-20 hover:scale-[1.01] hover:shadow-lg hover:rounded-xl hover:border-transparent'}`}>

                        <div
                          onClick={() => handleGameClick(game.appid)}
                          className="relative h-24 md:h-20 overflow-hidden cursor-pointer rounded-t-xl rounded-b-xl transition-all"
                          style={{ borderRadius: isExpanded ? '1rem 1rem 0 0' : 'inherit' }}
                        >
                          <div className="absolute inset-0 z-0 bg-white">
                            <GameBannerImage
                              appid={game.appid}
                              className="w-full h-full object-cover opacity-10 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent group-hover:from-white/90 group-hover:via-white/30 group-hover:to-transparent transition-all duration-300"></div>
                          </div>

                          <div className="relative z-10 h-full flex md:grid md:grid-cols-12 md:gap-4 items-center justify-between px-6">
                            <div className="flex items-center gap-4 flex-1 min-w-0 md:col-span-6">
                              <div className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-slate-200">
                                {game.img_icon_url ? <img src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`} alt="" className="w-full h-full object-cover rounded-lg" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-base md:text-lg truncate drop-shadow-sm group-hover:text-indigo-900 transition-colors">{game.name}</span>
                                {isExpanded && <span className="text-xs text-indigo-500 font-medium">Viewing Details</span>}
                              </div>
                            </div>

                            <div className="hidden md:flex md:col-span-2 justify-end">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-orange-50/90 backdrop-blur-md border border-orange-100 text-slate-700 font-mono text-xs font-bold shadow-sm group-hover:bg-orange-50/100 transition-colors">
                                {game.playtime_forever > 0 ? formatHours(game.playtime_forever) : '0.0'}h
                              </span>
                            </div>

                            <div className="hidden md:flex md:col-span-2 justify-center">
                              {game.playtime_forever === 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100/90 backdrop-blur-sm text-rose-700 text-xs font-bold border border-rose-200 shadow-sm">Unplayed</span>
                              ) : game.playtime_forever > 6000 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/90 backdrop-blur-sm text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">Favorite</span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100/90 backdrop-blur-sm text-indigo-700 text-xs font-bold border border-indigo-200 shadow-sm">Played</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 md:hidden">
                              <div className="w-24 flex justify-center">
                                {game.playtime_forever === 0 ? <span className="px-2 py-1 rounded-full bg-rose-100/90 backdrop-blur-sm text-rose-700 text-xs font-bold border border-rose-200 shadow-sm">Unplayed</span> : game.playtime_forever > 6000 ? <span className="px-2 py-1 rounded-full bg-emerald-100/90 backdrop-blur-sm text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">Fav</span> : <span className="px-2 py-1 rounded-full bg-indigo-100/90 backdrop-blur-sm text-indigo-700 text-xs font-bold border border-indigo-200 shadow-sm">Played</span>}
                              </div>
                            </div>

                            <div className="hidden md:flex md:col-span-2 justify-center">
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />}
                            </div>
                            <div className="md:hidden">
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />}
                            </div>
                          </div>
                        </div>

                        {/* Details Panel */}
                        {isExpanded && (
                          <div className="bg-slate-50/80 border-t border-slate-100 p-6 rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Playtime Analysis</h4>
                                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                    <div>
                                      <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Total Hours</span><span className="font-mono text-slate-700 font-bold">{formatNumber(game.playtime_forever / 60)}h</span></div>
                                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-indigo-400 h-full rounded-full" style={{ width: '100%' }}></div></div>
                                    </div>
                                    <div><span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Last Played</span><p className="text-slate-700 font-medium">{game.rtime_last_played ? formatDate(game.rtime_last_played) : 'Unknown'}</p></div>
                                    <div><span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Sessions</span><p className="text-slate-700 font-medium">{Math.max(1, Math.round(game.playtime_forever / 90))} <span className="text-slate-400 text-xs font-normal">(assuming 1.5h avg)</span></p></div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); openSteamStore(game.appid); }} className="flex-1 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-500 text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"><Gamepad2 className="w-4 h-4" /> Store</button>
                                  <button onClick={(e) => { e.stopPropagation(); openSteamDB(game.appid); }} className="flex-1 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-500 text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"><Database className="w-4 h-4" /> SteamDB</button>
                                </div>
                              </div>
                              <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                  <div className="flex items-center gap-2 mb-4"><div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600"><Activity className="w-4 h-4" /></div><h4 className="text-sm font-bold text-slate-700">Victory Heatmap</h4></div>
                                  {loadingAchId === game.appid ? (<div className="h-32 flex items-center justify-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading stats...</div>) : achs.length > 0 ? (<ActivityHeatmap achievements={achs} />) : (<div className="h-24 flex items-center justify-center text-slate-400 text-sm italic bg-slate-50 rounded-lg border border-dashed border-slate-200">No achievement history available for this game.</div>)}
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Achievement Vault</h4><span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{achs.length} Unlocked</span></div>
                                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {loadingAchId === game.appid ? (<div className="p-8 text-center text-slate-400 italic">Fetching trophy data...</div>) : achs.length > 0 ? (
                                      <div className="divide-y divide-slate-50">
                                        {achs.map((ach, idx) => (
                                          <div key={idx} className="p-3 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                            <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200 shrink-0"><Medal className="w-5 h-5 text-amber-500" /></div>
                                            <div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-700 truncate">{ach.name || ach.apiname}</p><p className="text-xs text-slate-400 truncate">{ach.description || "Unlocked via Steam"}</p></div>
                                            <div className="text-right shrink-0"><p className="text-xs font-bold text-slate-500">{ach.unlocktime ? formatDate(ach.unlocktime) : 'Unknown'}</p><p className="text-[10px] text-slate-300 font-mono">UNLOCKED</p></div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (<div className="p-8 text-center text-slate-400 text-sm">No unlocked achievements found.<br /><span className="text-xs opacity-70">(Or private profile settings)</span></div>)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm"><p className="text-slate-400 italic">No games found matching "{searchTerm}"</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}