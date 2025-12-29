import React from 'react';

const UserBanner = ({ userData }) => {
    return (
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
    );
};

export default UserBanner;
