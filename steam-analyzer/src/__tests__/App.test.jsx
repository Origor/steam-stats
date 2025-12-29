import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock hooks
vi.mock('../hooks/useSteamData', () => ({
    useSteamData: () => ({
        loading: false,
        error: null,
        userData: null,
        gamesData: [],
        isDemo: false,
        achievements: {},
        loadingAchId: null,
        loadDemoData: vi.fn(),
        fetchData: vi.fn(),
        fetchAchievements: vi.fn(),
    }),
}));

vi.mock('../hooks/useSteamStats', () => ({
    useSteamStats: () => ({
        stats: null,
        filteredGames: [],
        searchTerm: '',
        setSearchTerm: vi.fn(),
        selectedCategory: 'all',
        setSelectedCategory: vi.fn(),
    }),
}));

vi.mock('../hooks/useGeminiAI', () => ({
    useGeminiAI: () => ({
        aiProfile: null,
        aiRecommendation: null,
        aiValuation: null,
        aiLoadingType: null,
        generateGamerProfile: vi.fn(),
        suggestBacklogGame: vi.fn(),
        estimateAccountValue: vi.fn(),
    }),
}));

describe('App', () => {
    it('renders initial state correctly', () => {
        render(<App />);
        expect(screen.getByText('Waiting for data...')).toBeInTheDocument();
    });
});
