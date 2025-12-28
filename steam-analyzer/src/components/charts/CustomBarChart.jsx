import React from 'react';
import { formatNumber } from '../../utils/formatters';

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

export default CustomBarChart;
