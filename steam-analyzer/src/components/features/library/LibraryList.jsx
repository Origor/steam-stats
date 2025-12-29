import React from 'react';
import { Search } from 'lucide-react';
import LibraryListItem from './LibraryListItem';

const LibraryList = ({
    filteredGames,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    expandedGame,
    handleGameClick,
    achievements,
    loadingAchId
}) => {
    return (
        <div className="bg-transparent space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-800 pl-1">Full Library</h3>
                <div className="relative">
                    {selectedCategory && (
                        <span
                            className="absolute -top-7 right-0 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                            onClick={() => setSelectedCategory(null)}
                        >
                            Filter: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ✕
                        </span>
                    )}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 w-full sm:w-64 outline-none transition-all shadow-sm"
                    />
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

                    {filteredGames.map((game) => (
                        <LibraryListItem
                            key={game.appid}
                            game={game}
                            isExpanded={expandedGame === game.appid}
                            onClick={handleGameClick}
                            achievements={achievements}
                            loadingAchId={loadingAchId}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <p className="text-slate-400 italic">No games found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default LibraryList;
