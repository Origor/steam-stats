import React from 'react';
import { Search, ExternalLink, AlertTriangle } from 'lucide-react';

const SteamDataFetcher = ({
    steamApiKey,
    setSteamApiKey,
    steamId,
    setSteamId,
    useProxy,
    setUseProxy,
    fetchData,
    loading,
    error
}) => {
    return (
        <div className="mt-4 bg-orange-50/50 p-3 rounded-xl border border-orange-100 max-w-4xl mx-auto">
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
                        <a
                            href="https://steamcommunity.com/dev/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium"
                        >
                            Get API Key <ExternalLink className="w-3 h-3" />
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
                        <a
                            href="https://steamid.io/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 font-medium"
                        >
                            Find my ID <ExternalLink className="w-3 h-3" />
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
                            <AlertTriangle className="w-5 h-5 shrink-0" />{error}
                        </div>
                    )}
                </div>
            </details>
        </div>
    );
};

export default SteamDataFetcher;
