import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import SimpleMarkdown from '../common/SimpleMarkdown';

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

export default AICard;
