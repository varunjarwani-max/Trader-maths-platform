import React, { useState } from 'react';
import { Difficulty, SessionResult, TrainerId, LeaderboardEntry } from '../types';
import { Clock, Trophy, History, Play, Users, BarChart3, Info } from 'lucide-react';

interface SetupScreenProps {
  trainerId: TrainerId;
  durationMinutes: number;
  setDurationMinutes: (mins: number) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  personalBest: number | null;
  lastScores: SessionResult[];
  leaderboard: LeaderboardEntry[];
  onStartDrill: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  trainerId,
  durationMinutes,
  setDurationMinutes,
  difficulty,
  setDifficulty,
  personalBest,
  lastScores,
  leaderboard,
  onStartDrill,
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'leaderboard'>('setup');

  const titles: Record<TrainerId, { name: string; subtitle: string; icon: string }> = {
    speed: {
      name: 'Speed Arithmetic Trainer',
      subtitle: 'Practice high-frequency 2-digit multiplication, 3-digit division, squares, roots & percentages.',
      icon: '⚡',
    },
    sequence: {
      name: 'Number Logic Trainer',
      subtitle: 'Identify complex 5-number pattern rules: quadratic differences, interleaved dual series & Fibonacci.',
      icon: '🧠',
    },
    drill: {
      name: '80-in-8 Quant Assessment Drill',
      subtitle: 'Simulate trading assessment tests with mixed arithmetic, fractions, and precision decimals.',
      icon: '🎯',
    },
  };

  const difficultyDetails: Record<TrainerId, Record<Difficulty, string>> = {
    speed: {
      easy: 'Easy: 2-digit additions, 1-digit x 2-digit multiplication, simple division.',
      medium: 'Medium (Optiver Level): 2-digit x 2-digit (17×24), 3-digit ÷ 2-digit (528÷12), squares (24²), roots & percentages.',
      hard: 'Hard (Tradermath Hard): Large 2-digit x 2-digit (47×38), 4-digit division, signed operations & nested equations.',
    },
    sequence: {
      easy: 'Easy: Constant difference arithmetic patterns.',
      medium: 'Medium: Second-difference quadratic (+3, +5, +7...), n×(n+1) scales, and Fibonacci series.',
      hard: 'Hard: Interleaved dual sequences, recurrence relations (t_n = 2t_{n-1} - 3), and complex step accelerations.',
    },
    drill: {
      easy: 'Easy: 1 decimal place, simple fractions (denom ≤ 8).',
      medium: 'Medium: 2 decimal places (0.125, 0.375), fractions (denom ≤ 12), mixed operations.',
      hard: 'Hard: Precision decimals (0.036 ÷ 0.009), fraction operations (denom ≤ 20), combined math.',
    },
  };

  // Keyboard shortcut listener for Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activeTab === 'setup') {
        onStartDrill();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartDrill, activeTab]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{titles[trainerId].icon}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{titles[trainerId].name}</h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            {titles[trainerId].subtitle}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'setup'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Drill Setup
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Leaderboard ({leaderboard.length})
          </button>
        </div>
      </div>

      {activeTab === 'setup' ? (
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Main Controls Panel (2 columns) */}
          <div className="md:col-span-2 space-y-6 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            
            {/* 1. Timer Selector (1 to 10 minutes) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Drill Duration:
                </label>
                <span className="font-mono text-base font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                  {durationMinutes} {durationMinutes === 1 ? 'Minute' : 'Minutes'}
                </span>
              </div>

              {/* Range Slider */}
              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                
                {/* Tick marks */}
                <div className="flex justify-between text-[11px] font-mono text-slate-400 px-0.5">
                  <span>1m</span>
                  <span>2m</span>
                  <span>3m</span>
                  <span>4m</span>
                  <span>5m</span>
                  <span>6m</span>
                  <span>7m</span>
                  <span>8m</span>
                  <span>9m</span>
                  <span>10m</span>
                </div>
              </div>
            </div>

            {/* 2. Difficulty Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-900 block">
                Difficulty Tier:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
                  const isActive = difficulty === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${
                        isActive
                          ? d === 'easy'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs ring-1 ring-emerald-400'
                            : d === 'medium'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-2xs ring-1 ring-blue-400'
                            : 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs ring-1 ring-rose-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty Description */}
              <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg mt-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{difficultyDetails[trainerId][difficulty]}</span>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <button
                onClick={onStartDrill}
                className="w-full py-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-base rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                Start {durationMinutes}-Minute Drill
                <span className="text-xs font-mono font-normal opacity-80 bg-slate-800 px-2 py-0.5 rounded ml-2">
                  [Enter]
                </span>
              </button>
            </div>

          </div>

          {/* Side Personal Stats Widget (1 column) */}
          <div className="space-y-6">
            
            {/* Personal Best Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Trophy className="w-4 h-4" /> Personal Best
                </span>
                <span className="font-mono">{trainerId}</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {personalBest !== null ? personalBest : '—'}
                {personalBest !== null && <span className="text-sm text-slate-500 font-sans font-normal ml-1">pts</span>}
              </div>
            </div>

            {/* Recent 5 Scores */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <History className="w-4 h-4" /> Last 5 Sessions
                </span>
              </div>

              {lastScores.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No completed drills yet. Start your first session above!
                </p>
              ) : (
                <div className="space-y-2 divide-y divide-slate-100">
                  {lastScores.map((s, idx) => (
                    <div key={s.id || idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold font-mono text-slate-900 text-sm">
                          {s.score} <span className="text-[11px] font-normal text-slate-500">({s.correct}/{s.attempted})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          s.difficulty === 'easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.difficulty === 'medium'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {s.difficulty}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {s.durationMinutes}m • {s.accuracy.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Leaderboard View Tab */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top 10 Benchmark Leaderboard
            </h2>
            <span className="text-xs text-slate-500">Shared score rankings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3"># Rank</th>
                  <th className="py-2.5 px-3">Traders</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-center">Difficulty</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.isCurrentUser ? 'bg-blue-50/60 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-500">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      {item.name}
                      {item.isCurrentUser && (
                        <span className="text-[10px] bg-blue-600 text-white font-mono px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-blue-600 text-base">
                      {item.score}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        item.difficulty === 'easy'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.difficulty === 'medium'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {item.accuracy.toFixed(0)}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs text-slate-400">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
