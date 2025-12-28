import React, { useState } from 'react';
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
import {
  useSteamData
} from './hooks/useSteamData';
import {
  useSteamStats
} from './hooks/useSteamStats';
import {
  useGeminiAI
} from './hooks/useGeminiAI';
import ActivityHeatmap from './components/charts/ActivityHeatmap';
import CustomBarChart from './components/charts/CustomBarChart';
import CustomDonutChart from './components/charts/CustomDonutChart';
import StatCard from './components/cards/StatCard';
import AICard from './components/cards/AICard';
import SimpleMarkdown from './components/common/SimpleMarkdown';
import GameBannerImage from './components/common/GameBannerImage';

// --- GEMINI API CONFIGURATION ---
const googleApiKey = import.meta.env.DEV
  ? "" // OPTION 1: FOR PREVIEW (Active in Dev)
  : import.meta.env.VITE_GOOGLE_API_KEY || ""; // OPTION 2: FOR PRODUCTION (Active in Build)


// --- MOCK DATA REMOVED (Imported from ./mockData.js) ---

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

// --- COMPONENTS --- (Moved to src/components/)

// --- MAIN APP ---

export default function SteamAnalyzer() {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [expandedGame, setExpandedGame] = useState(null);

  // 1. Steam Data Hook
  const {
    loading,
    error,
    userData,
    gamesData,
    isDemo,
    achievements,
    loadingAchId,
    loadDemoData,
    fetchData,
    fetchAchievements
  } = useSteamData({ steamApiKey, steamId, useProxy });

  // 2. Steam Stats Hook
  const {
    stats,
    filteredGames,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory
  } = useSteamStats(gamesData);

  // 3. Gemini AI Hook
  const {
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
  } = useGeminiAI(googleApiKey);

  // Clear AI results when new data is fetched
  // We can't easily do this automatically inside the hooks without cross-communication or a context, 
  // so we'll just let the user regenerate insights if they fetch new data.
  // Or we could add an effect here if really needed, but keeping it simple is better.

  const handleGameClick = (appid) => {
    if (expandedGame === appid) {
      setExpandedGame(null);
    } else {
      setExpandedGame(appid);
      fetchAchievements(appid);
    }
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
              <AICard title="Gamer Profiler" icon={Brain} result={aiProfile} loading={aiLoadingType === 'profile'} onClick={() => generateGamerProfile(stats)} buttonText="Analyze Personality ✨" />
              <AICard title="Account Appraiser" icon={Calculator} result={aiValuation} loading={aiLoadingType === 'valuation'} onClick={() => estimateAccountValue(stats)} buttonText="Estimate Value (AI) 💰" />
              <AICard title="Backlog Recommender" icon={MessageSquare} result={aiRecommendation} loading={aiLoadingType === 'recommendation'} onClick={() => suggestBacklogGame(stats)} buttonText="Suggest Next Game ✨" />
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