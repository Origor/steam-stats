import React from 'react';
import { Clock, Gamepad2, AlertTriangle, Trophy } from 'lucide-react';
import StatCard from '../cards/StatCard';
import { formatNumber } from '../../utils/formatters';

const StatsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Playtime"
                value={`${formatNumber(stats.totalHours)}h`}
                subtext={`${((stats.totalHours / 24) / 365).toFixed(1)} years total`}
                icon={Clock}
                colorClass={{ bg: 'bg-blue-100', text: 'text-blue-500' }}
            />
            <StatCard
                title="Library Size"
                value={stats.totalGames}
                subtext="Games owned"
                icon={Gamepad2}
                colorClass={{ bg: 'bg-purple-100', text: 'text-purple-500' }}
            />
            <StatCard
                title="Pile of Shame"
                value={`${stats.shamePercentage}%`}
                subtext={`${stats.shameCount} unplayed games`}
                icon={AlertTriangle}
                colorClass={{ bg: 'bg-rose-100', text: 'text-rose-500' }}
            />
            <StatCard
                title="Avg. Session"
                value={`${stats.averagePlaytime}h`}
                subtext="Per played game"
                icon={Trophy}
                colorClass={{ bg: 'bg-emerald-100', text: 'text-emerald-500' }}
            />
        </div>
    );
};

export default StatsGrid;
