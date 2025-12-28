import React from 'react';

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

export default StatCard;
