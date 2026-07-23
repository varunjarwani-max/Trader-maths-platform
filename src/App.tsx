import React, { useState, useEffect } from 'react';
import { Difficulty, PageTab, SessionResult, TrainerId, LeaderboardEntry } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { SetupScreen } from './components/SetupScreen';
import { ActiveDrill } from './components/ActiveDrill';
import { ResultScreen } from './components/ResultScreen';
import {
  getPersonalBest,
  getLastScores,
  getLeaderboardForTrainer,
  saveSessionResult,
  getLastDisplayName,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('landing');

  // Active trainer parameters
  const [durationMinutes, setDurationMinutes] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [drillStage, setDrillStage] = useState<'setup' | 'active' | 'results'>('setup');

  // Stats & Storage
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [lastScores, setLastScores] = useState<SessionResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastStats, setLastStats] = useState<{
    score: number;
    attempted: number;
    correct: number;
    wrong: number;
    accuracy: number;
    bestStreak?: number;
  }>({
    score: 0,
    attempted: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
  });

  // Whenever the active tab changes or drill finishes, reload localStorage data for that trainer
  useEffect(() => {
    if (activeTab !== 'landing') {
      const trainer = activeTab as TrainerId;
      setPersonalBest(getPersonalBest(trainer));
      setLastScores(getLastScores(trainer));
      setLeaderboard(getLeaderboardForTrainer(trainer));

      // Set default timer duration depending on drill type
      if (trainer === 'drill') {
        setDurationMinutes(8); // Default 8 min for 80-in-8 drill
      } else if (durationMinutes === 8) {
        setDurationMinutes(1); // Default 1 min for speed & sequence
      }

      setDrillStage('setup');
    }
  }, [activeTab]);

  const handleSelectTrainer = (trainerId: TrainerId) => {
    setActiveTab(trainerId);
  };

  const handleStartDrill = () => {
    setDrillStage('active');
  };

  const handleFinishDrill = (stats: {
    score: number;
    attempted: number;
    correct: number;
    wrong: number;
    accuracy: number;
    bestStreak?: number;
  }) => {
    if (activeTab === 'landing') return;

    const trainer = activeTab as TrainerId;
    const session: SessionResult = {
      id: `session-${Date.now()}`,
      trainerId: trainer,
      date: new Date().toISOString(),
      score: stats.score,
      attempted: stats.attempted,
      correct: stats.correct,
      wrong: stats.wrong,
      accuracy: stats.accuracy,
      durationMinutes,
      difficulty,
    };

    // Save session to localStorage
    saveSessionResult(session);

    // Refresh metrics
    setLastStats(stats);
    setPersonalBest(getPersonalBest(trainer));
    setLastScores(getLastScores(trainer));
    setLeaderboard(getLeaderboardForTrainer(trainer));

    setDrillStage('results');
  };

  const handleQuitDrill = () => {
    setDrillStage('setup');
  };

  const handleRetry = () => {
    setDrillStage('active');
  };

  const handleBackToSetup = () => {
    setDrillStage('setup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Global Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page View Content */}
      <main className="flex-1 py-6">
        {activeTab === 'landing' ? (
          <LandingPage onSelectTrainer={handleSelectTrainer} />
        ) : (
          <div>
            {drillStage === 'setup' && (
              <SetupScreen
                trainerId={activeTab as TrainerId}
                durationMinutes={durationMinutes}
                setDurationMinutes={setDurationMinutes}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                personalBest={personalBest}
                lastScores={lastScores}
                leaderboard={leaderboard}
                onStartDrill={handleStartDrill}
              />
            )}

            {drillStage === 'active' && (
              <ActiveDrill
                trainerId={activeTab as TrainerId}
                durationMinutes={durationMinutes}
                difficulty={difficulty}
                onFinishDrill={handleFinishDrill}
                onQuitDrill={handleQuitDrill}
              />
            )}

            {drillStage === 'results' && (
              <ResultScreen
                trainerId={activeTab as TrainerId}
                durationMinutes={durationMinutes}
                difficulty={difficulty}
                stats={lastStats}
                initialDisplayName={getLastDisplayName()}
                leaderboard={leaderboard}
                onRetry={handleRetry}
                onBackToSetup={handleBackToSetup}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TraderMath Quant Prep • High-Speed Mental Math Trainer</span>
          <span>4-Button MCQ • Local Score Storage • Leaderboard Rankings</span>
        </div>
      </footer>

    </div>
  );
}
