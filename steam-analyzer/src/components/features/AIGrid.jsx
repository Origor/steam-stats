import React from 'react';
import { Brain, Calculator, MessageSquare } from 'lucide-react';
import AICard from '../cards/AICard';

const AIGrid = ({
    aiProfile,
    aiRecommendation,
    aiValuation,
    aiLoadingType,
    generateGamerProfile,
    suggestBacklogGame,
    estimateAccountValue,
    stats
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AICard
                title="Gamer Profiler"
                icon={Brain}
                result={aiProfile}
                loading={aiLoadingType === 'profile'}
                onClick={() => generateGamerProfile(stats)}
                buttonText="Analyze Personality ✨"
            />
            <AICard
                title="Account Appraiser"
                icon={Calculator}
                result={aiValuation}
                loading={aiLoadingType === 'valuation'}
                onClick={() => estimateAccountValue(stats)}
                buttonText="Estimate Value (AI) 💰"
            />
            <AICard
                title="Backlog Recommender"
                icon={MessageSquare}
                result={aiRecommendation}
                loading={aiLoadingType === 'recommendation'}
                onClick={() => suggestBacklogGame(stats)}
                buttonText="Suggest Next Game ✨"
            />
        </div>
    );
};

export default AIGrid;
