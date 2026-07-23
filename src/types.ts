export type Difficulty = 'easy' | 'medium' | 'hard';

export type TrainerId = 'speed' | 'sequence' | 'drill';

export type PageTab = 'landing' | TrainerId;

export interface MCQOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  value: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  expression: string; // Equation or sequence to display
  subtext?: string;   // e.g. "Find the missing 6th term" or "Solve the expression"
  options: MCQOption[];
  correctIndex: number;
  explanation?: string;
  type?: string;
}

export interface SessionResult {
  id: string;
  trainerId: TrainerId;
  date: string; // ISO string
  score: number; // Net score (+1 / -1) or Total Correct
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number; // 0 - 100
  durationMinutes: number;
  difficulty: Difficulty;
  displayName?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  attempted: number;
  accuracy: number;
  difficulty: Difficulty;
  date: string;
  isCurrentUser?: boolean;
}
