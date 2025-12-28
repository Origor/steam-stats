import { useMemo, useState } from 'react';

export function useSteamStats(gamesData) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const stats = useMemo(() => {
        if (!gamesData) return null;
        const totalGames = gamesData.length;
        const totalMinutes = gamesData.reduce((acc, game) => acc + game.playtime_forever, 0);
        const totalHours = totalMinutes / 60;
        const unplayed = gamesData.filter(g => g.playtime_forever < 60);
        const played = gamesData.filter(g => g.playtime_forever >= 60);
        const shamePercentage = ((unplayed.length / totalGames) * 100).toFixed(1);
        const sortedGames = [...gamesData].sort((a, b) => b.playtime_forever - a.playtime_forever);
        const top5 = sortedGames.slice(0, 5).map(g => ({ label: g.name, value: Math.round(g.playtime_forever / 60) }));
        const distData = [
            { id: 'unplayed', label: 'Unplayed (< 1h)', value: 0, color: '#fca5a5' },
            { id: 'casual', label: 'Casual (1-10h)', value: 0, color: '#fcd34d' },
            { id: 'regular', label: 'Regular (10-100h)', value: 0, color: '#93c5fd' },
            { id: 'addict', label: 'Addict (100h+)', value: 0, color: '#6ee7b7' }
        ];
        gamesData.forEach(g => {
            const h = g.playtime_forever / 60;
            if (h < 1) distData[0].value++; else if (h < 10) distData[1].value++; else if (h < 100) distData[2].value++; else distData[3].value++;
        });
        const activeDistData = distData.filter(d => d.value > 0);
        return {
            totalGames,
            totalHours: Math.round(totalHours),
            shameCount: unplayed.length,
            shamePercentage,
            averagePlaytime: (totalHours / (played.length || 1)).toFixed(1),
            top5,
            distData: activeDistData,
            sortedGames,
            unplayedGames: unplayed
        };
    }, [gamesData]);

    const filteredGames = useMemo(() => {
        if (!gamesData) return [];
        let result = [...gamesData]
            .sort((a, b) => b.playtime_forever - a.playtime_forever);

        if (searchTerm) {
            result = result.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedCategory) {
            result = result.filter(g => {
                const h = g.playtime_forever / 60;
                if (selectedCategory === 'unplayed') return h < 1;
                if (selectedCategory === 'casual') return h >= 1 && h < 10;
                if (selectedCategory === 'regular') return h >= 10 && h < 100;
                if (selectedCategory === 'addict') return h >= 100;
                return true;
            });
        }

        return result;
    }, [gamesData, searchTerm, selectedCategory]);

    return {
        stats,
        filteredGames,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory
    };
}
