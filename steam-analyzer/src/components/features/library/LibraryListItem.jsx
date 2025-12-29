import React from 'react';
import { ChevronDown, ChevronUp, Clock, Gamepad2, Database, Activity, Loader2, Trophy, Medal, ImageIcon } from 'lucide-react';
import GameBannerImage from '../../common/GameBannerImage';
import GameIcon from '../../common/GameIcon';
import ActivityHeatmap from '../../charts/ActivityHeatmap';
import { formatHours, formatNumber, formatDate } from '../../../utils/formatters';
import { openSteamDB, openSteamStore } from '../../../utils/links';

const LibraryListItem = ({ game, isExpanded, onClick, achievements, loadingAchId }) => {
    const achs = achievements[game.appid] || [];

    return (
        <div className={`group relative w-full bg-white border-b border-slate-100 last:border-b-0 last:rounded-b-2xl transition-all duration-300 ease-out origin-center cursor-default ${isExpanded ? 'z-30 my-4 rounded-2xl shadow-xl border-slate-200 scale-[1.01]' : 'hover:z-20 hover:scale-[1.01] hover:shadow-lg hover:rounded-xl hover:border-transparent'}`}>

            <div
                onClick={() => onClick(game.appid)}
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
                        <div className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-slate-200 overflow-hidden">
                            {game.img_icon_url ? (
                                <GameIcon
                                    appid={game.appid}
                                    iconUrl={game.img_icon_url}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
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
    );
};

export default LibraryListItem;
