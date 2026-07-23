import { LeaderboardEntry, SessionResult, TrainerId } from '../types';

const SESSIONS_KEY = 'tradermath_sessions_v1';
const LEADERBOARD_KEY = 'tradermath_leaderboards_v1';
const LAST_NAME_KEY = 'tradermath_last_display_name_v1';

// Seed benchmark scores for initial leaderboard
const INITIAL_LEADERBOARD_SEEDS: Record<TrainerId, LeaderboardEntry[]> = {
  speed: [
    { id: 'seed-1', name: 'AlphaQuant_NY', score: 58, attempted: 60, accuracy: 96.7, difficulty: 'hard', date: '2026-07-22' },
    { id: 'seed-2', name: 'OptiverPrep99', score: 52, attempted: 54, accuracy: 96.3, difficulty: 'hard', date: '2026-07-21' },
    { id: 'seed-3', name: 'Citadel_Intern', score: 48, attempted: 50, accuracy: 96.0, difficulty: 'medium', date: '2026-07-23' },
    { id: 'seed-4', name: 'JaneStreetFan', score: 44, attempted: 46, accuracy: 95.6, difficulty: 'medium', date: '2026-07-20' },
    { id: 'seed-5', name: 'SigmaTrader', score: 41, attempted: 43, accuracy: 95.3, difficulty: 'medium', date: '2026-07-19' },
    { id: 'seed-6', name: 'FastMath_Desk', score: 38, attempted: 40, accuracy: 95.0, difficulty: 'easy', date: '2026-07-18' },
    { id: 'seed-7', name: 'QuantDev_LDN', score: 35, attempted: 37, accuracy: 94.6, difficulty: 'easy', date: '2026-07-17' },
    { id: 'seed-8', name: 'DerivativesPro', score: 32, attempted: 34, accuracy: 94.1, difficulty: 'easy', date: '2026-07-16' },
  ],
  sequence: [
    { id: 'seed-10', name: 'PatternMaster', score: 42, attempted: 43, accuracy: 97.6, difficulty: 'hard', date: '2026-07-22' },
    { id: 'seed-11', name: 'NeuralQuant', score: 38, attempted: 39, accuracy: 97.4, difficulty: 'hard', date: '2026-07-21' },
    { id: 'seed-12', name: 'LogicKing', score: 35, attempted: 36, accuracy: 97.2, difficulty: 'medium', date: '2026-07-23' },
    { id: 'seed-13', name: 'SequenceWizard', score: 31, attempted: 32, accuracy: 96.8, difficulty: 'medium', date: '2026-07-20' },
    { id: 'seed-14', name: 'MatrixTrader', score: 28, attempted: 29, accuracy: 96.5, difficulty: 'medium', date: '2026-07-19' },
    { id: 'seed-15', name: 'MathSolve_HK', score: 25, attempted: 26, accuracy: 96.1, difficulty: 'easy', date: '2026-07-18' },
    { id: 'seed-16', name: 'Euler_Fan', score: 22, attempted: 23, accuracy: 95.6, difficulty: 'easy', date: '2026-07-15' },
  ],
  drill: [
    { id: 'seed-20', name: 'Optiver80Plus', score: 78, attempted: 80, accuracy: 98.7, difficulty: 'hard', date: '2026-07-22' },
    { id: 'seed-21', name: 'FlowTrader_AMS', score: 74, attempted: 78, accuracy: 97.4, difficulty: 'hard', date: '2026-07-21' },
    { id: 'seed-22', name: '80in8_Guru', score: 71, attempted: 75, accuracy: 97.3, difficulty: 'medium', date: '2026-07-23' },
    { id: 'seed-23', name: 'PropDesk_SG', score: 65, attempted: 70, accuracy: 95.7, difficulty: 'medium', date: '2026-07-20' },
    { id: 'seed-24', name: 'MarketMaker_SGP', score: 60, attempted: 66, accuracy: 95.4, difficulty: 'medium', date: '2026-07-19' },
    { id: 'seed-25', name: 'SpeedRunner', score: 55, attempted: 60, accuracy: 95.0, difficulty: 'easy', date: '2026-07-18' },
    { id: 'seed-26', name: 'ArbTrader', score: 48, attempted: 52, accuracy: 94.2, difficulty: 'easy', date: '2026-07-16' },
  ]
};

// ================= USER SESSIONS =================

export function getAllSessions(): SessionResult[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read sessions from localStorage', err);
    return [];
  }
}

export function saveSessionResult(session: SessionResult): void {
  try {
    const sessions = getAllSessions();
    sessions.unshift(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }
}

export function getPersonalBest(trainerId: TrainerId): number | null {
  const sessions = getAllSessions().filter(s => s.trainerId === trainerId);
  if (sessions.length === 0) return null;
  return Math.max(...sessions.map(s => s.score));
}

export function getLastScores(trainerId: TrainerId, limit = 5): SessionResult[] {
  const sessions = getAllSessions().filter(s => s.trainerId === trainerId);
  return sessions.slice(0, limit);
}

// ================= DISPLAY NAME =================

export function getLastDisplayName(): string {
  try {
    return localStorage.getItem(LAST_NAME_KEY) || 'Quant_Trader';
  } catch {
    return 'Quant_Trader';
  }
}

export function saveLastDisplayName(name: string): void {
  try {
    if (name.trim()) {
      localStorage.setItem(LAST_NAME_KEY, name.trim());
    }
  } catch (err) {
    console.error('Failed to save display name', err);
  }
}

// ================= LEADERBOARD =================

export function getLeaderboards(): Record<TrainerId, LeaderboardEntry[]> {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        speed: parsed.speed || INITIAL_LEADERBOARD_SEEDS.speed,
        sequence: parsed.sequence || INITIAL_LEADERBOARD_SEEDS.sequence,
        drill: parsed.drill || INITIAL_LEADERBOARD_SEEDS.drill,
      };
    }
  } catch (err) {
    console.error('Failed to read leaderboards', err);
  }
  return INITIAL_LEADERBOARD_SEEDS;
}

export function getLeaderboardForTrainer(trainerId: TrainerId, limit = 10): LeaderboardEntry[] {
  const all = getLeaderboards();
  const entries = all[trainerId] || [];
  // Sort descending by score, then accuracy
  const sorted = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.accuracy - a.accuracy;
  });
  return sorted.slice(0, limit);
}

export function addLeaderboardEntry(trainerId: TrainerId, newEntry: Omit<LeaderboardEntry, 'id'>): LeaderboardEntry[] {
  try {
    const all = getLeaderboards();
    const trainerList = all[trainerId] || [];
    
    const entry: LeaderboardEntry = {
      ...newEntry,
      id: `lb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };

    trainerList.push(entry);

    // Sort descending by score, then accuracy
    trainerList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.accuracy - a.accuracy;
    });

    // Keep top 25
    all[trainerId] = trainerList.slice(0, 25);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(all));
    return getLeaderboardForTrainer(trainerId);
  } catch (err) {
    console.error('Failed to save leaderboard entry', err);
    return getLeaderboardForTrainer(trainerId);
  }
}
