import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSteamData } from './hooks/useSteamData';
import { useSteamStats } from './hooks/useSteamStats';
import { useGeminiAI } from './hooks/useGeminiAI';

import Header from './components/layout/Header';
import SteamDataFetcher from './components/features/SteamDataFetcher';
import UserBanner from './components/features/UserBanner';
import AIGrid from './components/features/AIGrid';
import StatsGrid from './components/features/StatsGrid';
import ChartsSection from './components/features/ChartsSection';
import LibraryList from './components/features/library/LibraryList';

// --- GEMINI API CONFIGURATION ---
const googleApiKey = import.meta.env.DEV
  ? "" // OPTION 1: FOR PREVIEW (Active in Dev)
  : import.meta.env.VITE_GOOGLE_API_KEY || ""; // OPTION 2: FOR PRODUCTION (Active in Build)

// --- MAIN APP ---

export default function SteamAnalyzer() {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [expandedGame, setExpandedGame] = useState(null);

  // 1. Steam Data Hook
  const {
    loading,
    error,
    userData,
    gamesData,
    isDemo,
    achievements,
    loadingAchId,
    loadDemoData,
    fetchData,
    fetchAchievements
  } = useSteamData({ steamApiKey, steamId, useProxy });

  // 2. Steam Stats Hook
  const {
    stats,
    filteredGames,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory
  } = useSteamStats(gamesData);

  // 3. Gemini AI Hook
  const {
    aiProfile,
    aiRecommendation,
    aiValuation,
    aiLoadingType,
    generateGamerProfile,
    suggestBacklogGame,
    estimateAccountValue,
    // esLint-ignore-next-line
    // setAiProfile,
    // setAiRecommendation,
    // setAiValuation
  } = useGeminiAI(googleApiKey);

  // Clear AI results when new data is fetched
  // We can't easily do this automatically inside the hooks without cross-communication or a context, 
  // so we'll just let the user regenerate insights if they fetch new data.
  // Or we could add an effect here if really needed, but keeping it simple is better.

  const handleGameClick = (appid) => {
    if (expandedGame === appid) {
      setExpandedGame(null);
    } else {
      setExpandedGame(appid);
      fetchAchievements(appid);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 pb-20">
      <Header userData={userData} isDemo={isDemo} loadDemoData={loadDemoData} />

      <SteamDataFetcher
        steamApiKey={steamApiKey}
        setSteamApiKey={setSteamApiKey}
        steamId={steamId}
        setSteamId={setSteamId}
        useProxy={useProxy}
        setUseProxy={setUseProxy}
        fetchData={fetchData}
        loading={loading}
        error={error}
      />

      <div className="container mx-auto px-4 py-8">
        {!userData || !stats ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-10 h-10 animate-spin mb-4 text-indigo-300" />
            <p className="font-medium">Waiting for data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <UserBanner userData={userData} />

            <AIGrid
              aiProfile={aiProfile}
              aiRecommendation={aiRecommendation}
              aiValuation={aiValuation}
              aiLoadingType={aiLoadingType}
              generateGamerProfile={generateGamerProfile}
              suggestBacklogGame={suggestBacklogGame}
              estimateAccountValue={estimateAccountValue}
              stats={stats}
            />

            <StatsGrid stats={stats} />

            <ChartsSection
              stats={stats}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <LibraryList
              filteredGames={filteredGames}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              expandedGame={expandedGame}
              handleGameClick={handleGameClick}
              achievements={achievements}
              loadingAchId={loadingAchId}
            />
          </div>
        )}
      </div>
    </div>
  );
}