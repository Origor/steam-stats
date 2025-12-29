import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import CustomBarChart from '../charts/CustomBarChart';
import CustomDonutChart from '../charts/CustomDonutChart';

const ChartsSection = ({ stats, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-400" />Top 5 Most Played
                    </h3>
                </div>
                <CustomBarChart data={stats.top5} />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-400" />Library Habits
                    </h3>
                </div>
                <CustomDonutChart
                    data={stats.distData}
                    onCategorySelect={(id) => setSelectedCategory(prev => prev === id ? null : id)}
                    selectedCategory={selectedCategory}
                />
            </div>
        </div>
    );
};

export default ChartsSection;
