import React from 'react';
import { Gamepad2, Info, User, Database, ExternalLink } from 'lucide-react';

const Header = ({ userData, isDemo, loadDemoData }) => {
    return (
        <div className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
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
                            <Info className="w-3.5 h-3.5 mr-1.5" /> Viewing Demo Mode
                        </div>
                    ) : (
                        <div className="flex items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-emerald-600 text-xs font-medium">
                            <User className="w-3.5 h-3.5 mr-1.5" /> Live Data
                        </div>
                    )}
                    {userData && (
                        <a
                            href={`https://steamdb.info/calculator/${userData.steamid}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors group"
                        >
                            <Database className="w-3.5 h-3.5 mr-1.5 text-slate-400 group-hover:text-slate-600" /> SteamDB
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
        </div>
    );
};

export default Header;
