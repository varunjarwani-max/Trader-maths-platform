import React, { useState } from 'react';
import { Difficulty, TrainerId, LeaderboardEntry } from '../types';
import { saveLastDisplayName, addLeaderboardEntry } from '../utils/storage';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight, UserCheck, Award } from 'lucide-react';

interface ResultScreenProps {
  trainerId: TrainerId;
  durationMinutes: number;
  difficulty: Difficulty;
  stats: {
    score: number;
    attempted: number;
    correct: number;
    wrong: number;
    accuracy: number;
    bestStreak?: number;
  };
  initialDisplayName: string;
  leaderboard: LeaderboardEntry[];
  onRetry: () => void;
  onBackToSetup: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  trainerId,
  durationMinutes,
  difficulty,
  stats,
  initialDisplayName,
  leaderboard: initialLeaderboard,
  onRetry,
  onBackToSetup,
}) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    saveLastDisplayName(displayName);

    const updatedLeaderboard = addLeaderboardEntry(trainerId, {
      name: displayName.trim(),
      score: stats.score,
      attempted: stats.attempted,
      accuracy: stats.accuracy,
      difficulty,
      date: new Date().toISOString().split('T')[0],
      isCurrentUser: true,
    });

    setLeaderboard(updatedLeaderboard);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-8 shadow-xs text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-400 font-mono text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" /> Session Completed
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Drill Performance Overview
        </h1>

        <p className="text-sm text-slate-400 font-mono">
          {trainerId.toUpperCase()} • {difficulty.toUpperCase()} • {durationMinutes} MIN DRILL
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Net Score / Primary Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold block">
            {trainerId === 'drill' ? 'Net Score (+1 / −1)' : 'Score (Correct)'}
          </span>
          <div className="text-3xl font-extrabold font-mono text-blue-600">
            {stats.score}
          </div>
        </div>

        {/* Total Attempted */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold block">
            Total Attempted
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {stats.attempted}
          </div>
        </div>

        {/* Correct / Wrong Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold block">
            Correct / Wrong
          </span>
          <div className="text-2xl font-extrabold font-mono flex items-center justify-center gap-2 pt-0.5">
            <span className="text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-4 h-4" /> {stats.correct}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-rose-600 flex items-center gap-0.5">
              <XCircle className="w-4 h-4" /> {stats.wrong}
            </span>
          </div>
        </div>

        {/* Accuracy % or Best Streak */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold block">
            {trainerId === 'sequence' ? 'Best Streak' : 'Accuracy'}
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {trainerId === 'sequence' ? stats.bestStreak || 0 : `${stats.accuracy.toFixed(0)}%`}
          </div>
        </div>

      </div>

      {/* Leaderboard Submission Prompt */}
      {!submitted ? (
        <form
          onSubmit={handleSubmitScore}
          className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Submit Score to Shared Leaderboard
            </h2>
            <p className="text-xs text-slate-600">
              Enter a display name to post your {stats.score} pt score on the global top 10 board.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              maxLength={20}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Display Name"
              className="px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              Submit Score
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 text-center text-sm font-bold flex items-center justify-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          Score successfully submitted as <span className="font-mono text-emerald-950 underline">{displayName}</span>!
        </div>
      )}

      {/* Top 10 Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top 10 Leaderboard — {trainerId.toUpperCase()}
          </h2>
          <span className="text-xs font-mono text-slate-500">Highest scores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3"># Rank</th>
                <th className="py-2.5 px-3">Trader</th>
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
                  className={`hover:bg-slate-50 transition-colors ${
                    item.isCurrentUser ? 'bg-blue-50/70 font-semibold' : ''
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Retry Drill
        </button>

        <button
          onClick={onBackToSetup}
          className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          Change Setup / Trainer <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
