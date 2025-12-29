import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSteamData } from './useSteamData';
import { getBackendSteamData } from '../services/steamApi';
import { MOCK_USER, MOCK_GAMES } from '../mockData';

// Mock the service layer
vi.mock('../services/steamApi', () => ({
    getBackendSteamData: vi.fn(),
    getPlayerAchievements: vi.fn(),
}));

describe('useSteamData Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads demo data by default on mount', async () => {
        const { result } = renderHook(() => useSteamData({}));

        // Initially starts loading demo data
        expect(result.current.loading).toBe(true);

        // Wait for demo data timeout (800ms in actual code, mocked timers could speed this up but integration style is fine for now)
        await waitFor(() => {
            expect(result.current.userData).toEqual(MOCK_USER);
        }, { timeout: 2000 });

        expect(result.current.gamesData).toEqual(MOCK_GAMES);
        expect(result.current.isDemo).toBe(true);
        expect(result.current.loading).toBe(false);
    });

    it('validates missing inputs for fetchData', async () => {
        const { result } = renderHook(() => useSteamData({ steamApiKey: '', steamId: '' }));

        // Wait for initial demo load to settle first to avoid interference
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.error).toMatch(/Please provide/);
    });

    it('validates missing steamID for fetchData', async () => {
        // Providing only API key (or reliant on dev env) but no ID
        const { result } = renderHook(() => useSteamData({ steamApiKey: 'TEST_KEY', steamId: '' }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.error).toBe("Please provide a Steam ID.");
    });


    it('fetches real data successfully', async () => {
        const mockBackendResponse = {
            player_summary: {
                response: {
                    players: [{ steamid: '123', personaname: 'Real User' }]
                }
            },
            owned_games: {
                response: {
                    games: [{ appid: 1, name: 'Game 1' }]
                }
            }
        };

        getBackendSteamData.mockResolvedValue(mockBackendResponse);

        const { result } = renderHook(() => useSteamData({ steamApiKey: 'TEST_KEY', steamId: '123' }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('');
        expect(result.current.isDemo).toBe(false);
        expect(result.current.userData).toEqual(mockBackendResponse.player_summary.response.players[0]);
        expect(result.current.gamesData).toEqual(mockBackendResponse.owned_games.response.games);
        expect(getBackendSteamData).toHaveBeenCalledWith('123');
    });

    it('handles backend fetch errors', async () => {
        getBackendSteamData.mockRejectedValue(new Error('Backend Offline'));

        const { result } = renderHook(() => useSteamData({ steamApiKey: 'TEST_KEY', steamId: '123' }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.fetchData();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toMatch(/Failed to fetch data from backend/);
        expect(result.current.error).toMatch(/Backend Offline/);
    });
});
