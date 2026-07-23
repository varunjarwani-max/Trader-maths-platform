import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, Question, TrainerId } from '../types';
import {
  generateSpeedArithmeticQuestion,
  generateNumberLogicQuestion,
  generateEightyInEightQuestion,
} from '../utils/generators';
import { Flame, StopCircle } from 'lucide-react';

interface ActiveDrillProps {
  trainerId: TrainerId;
  durationMinutes: number;
  difficulty: Difficulty;
  onFinishDrill: (stats: {
    score: number;
    attempted: number;
    correct: number;
    wrong: number;
    accuracy: number;
    bestStreak: number;
  }) => void;
  onQuitDrill: () => void;
}

export const ActiveDrill: React.FC<ActiveDrillProps> = ({
  trainerId,
  durationMinutes,
  difficulty,
  onFinishDrill,
  onQuitDrill,
}) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  
  // Drill Stats State
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [attempted, setAttempted] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  
  // Tab 2 (Number Logic) Streaks
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Tab 3 (80-in-8) Net Score (+1 / -1)
  const [netScore, setNetScore] = useState<number>(0);

  // Active Question
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => {
    if (trainerId === 'speed') return generateSpeedArithmeticQuestion(difficulty);
    if (trainerId === 'sequence') return generateNumberLogicQuestion(difficulty);
    return generateEightyInEightQuestion(difficulty);
  });

  // Visual feedback animation state (flash green or red on choice)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Helper to generate next question based on trainer
  const fetchNextQuestion = useCallback(() => {
    if (trainerId === 'speed') return generateSpeedArithmeticQuestion(difficulty);
    if (trainerId === 'sequence') return generateNumberLogicQuestion(difficulty);
    return generateEightyInEightQuestion(difficulty);
  }, [trainerId, difficulty]);

  // Finish callback wrapper
  const triggerFinish = useCallback(() => {
    const finalScore = trainerId === 'drill' ? netScore : correct;
    const finalAttempted = attempted;
    const finalAccuracy = finalAttempted > 0 ? (correct / finalAttempted) * 100 : 0;

    onFinishDrill({
      score: finalScore,
      attempted: finalAttempted,
      correct,
      wrong,
      accuracy: finalAccuracy,
      bestStreak,
    });
  }, [trainerId, netScore, correct, attempted, wrong, bestStreak, onFinishDrill]);

  // Timer Interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Check for timer end
  useEffect(() => {
    if (secondsRemaining === 0) {
      triggerFinish();
    }
  }, [secondsRemaining, triggerFinish]);

  // Check for 80 questions limit in 80-in-8 drill
  useEffect(() => {
    if (trainerId === 'drill' && attempted >= 80) {
      triggerFinish();
    }
  }, [trainerId, attempted, triggerFinish]);

  // Answer selection handler
  const handleAnswerSelect = useCallback((isCorrectChoice: boolean) => {
    const nextAttempted = attempted + 1;
    setAttempted(nextAttempted);

    if (isCorrectChoice) {
      setCorrect((prev) => prev + 1);
      setNetScore((prev) => prev + 1);
      
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      
      setFeedback('correct');
    } else {
      setWrong((prev) => prev + 1);
      setNetScore((prev) => prev - 1);
      setCurrentStreak(0);
      setFeedback('wrong');
    }

    // Brief feedback state reset and advance to next question instantly
    setTimeout(() => {
      setFeedback(null);
    }, 150);

    setQuestionCount((prev) => prev + 1);
    setCurrentQuestion(fetchNextQuestion());
  }, [attempted, currentStreak, bestStreak, fetchNextQuestion]);

  // Keyboard Shortcuts (1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      let optionIndex = -1;

      if (['1', 'A'].includes(key)) optionIndex = 0;
      else if (['2', 'B'].includes(key)) optionIndex = 1;
      else if (['3', 'C'].includes(key)) optionIndex = 2;
      else if (['4', 'D'].includes(key)) optionIndex = 3;

      if (optionIndex !== -1 && currentQuestion.options[optionIndex]) {
        e.preventDefault();
        handleAnswerSelect(currentQuestion.options[optionIndex].isCorrect);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, handleAnswerSelect]);

  // Format time mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Progress ratio for top timer bar
  const timerRatio = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 shadow-xs relative overflow-hidden space-y-4">
        
        {/* Animated Timer Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 linear ${
              timerRatio > 30 ? 'bg-blue-500' : 'bg-rose-500'
            }`}
            style={{ width: `${timerRatio}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Question Counter */}
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-wider font-mono text-slate-400">
              {trainerId === 'drill' ? 'Question Progress' : 'Current Question'}
            </span>
            <div className="text-xl font-extrabold font-mono text-white">
              {trainerId === 'drill' ? `${questionCount} / 80` : `#${questionCount}`}
            </div>
          </div>

          {/* Big Timer */}
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider font-mono text-slate-400 block">
              Time Remaining
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-tight">
              {formattedTime}
            </span>
          </div>

          {/* Live Metrics */}
          <div className="text-right space-y-0.5">
            <span className="text-xs uppercase tracking-wider font-mono text-slate-400">
              {trainerId === 'sequence' ? 'Streak' : trainerId === 'drill' ? 'Net Score' : 'Correct'}
            </span>
            <div className="text-xl font-extrabold font-mono text-white flex items-center justify-end gap-1.5">
              {trainerId === 'sequence' ? (
                <>
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>{currentStreak}</span>
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    (Best: {bestStreak})
                  </span>
                </>
              ) : trainerId === 'drill' ? (
                <span className={netScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {netScore > 0 ? `+${netScore}` : netScore}
                </span>
              ) : (
                <span className="text-emerald-400">{correct}</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Question Card Display */}
      <div className={`bg-white border-2 rounded-2xl p-8 sm:p-10 shadow-2xs transition-colors text-center space-y-4 relative ${
        feedback === 'correct'
          ? 'border-emerald-500 bg-emerald-50/20'
          : feedback === 'wrong'
          ? 'border-rose-500 bg-rose-50/20'
          : 'border-slate-200'
      }`}>
        
        {currentQuestion.subtext && (
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold block">
            {currentQuestion.subtext}
          </span>
        )}

        {/* Large Equation / Sequence */}
        <div className="text-3xl sm:text-5xl font-extrabold font-mono text-slate-900 tracking-wide py-4 select-none">
          {currentQuestion.expression}
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-[11px] font-mono text-slate-400">
          Click options below or press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-700">1</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-700">2</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-700">3</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-700">4</kbd> on keyboard
        </p>
      </div>

      {/* 4 MCQ Answer Buttons Grid */}
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={opt.id}
            onClick={() => handleAnswerSelect(opt.isCorrect)}
            className="group bg-white hover:bg-[#0F172A] text-slate-900 hover:text-white border-2 border-slate-200 hover:border-[#0F172A] rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-150 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-800 text-slate-700 group-hover:text-amber-400 font-mono font-bold text-sm flex items-center justify-center transition-colors">
              {opt.label}
            </span>

            <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight">
              {opt.value}
            </span>

            <span className="w-6 text-right font-mono text-xs text-slate-400 group-hover:text-slate-500">
              [{idx + 1}]
            </span>
          </button>
        ))}
      </div>

      {/* Quit Button */}
      <div className="text-center pt-2">
        <button
          onClick={onQuitDrill}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-rose-600 transition-colors py-2 px-3 rounded-md hover:bg-slate-100 cursor-pointer"
        >
          <StopCircle className="w-4 h-4" /> Quit Session Early
        </button>
      </div>

    </div>
  );
};
