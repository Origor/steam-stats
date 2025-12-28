import React, { useMemo } from 'react';

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

export default ActivityHeatmap;
