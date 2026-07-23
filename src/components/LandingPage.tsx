import React from 'react';
import { TrainerId } from '../types';
import { Zap, Brain, Target, ArrowRight, Shield, Clock, BarChart2, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onSelectTrainer: (trainerId: TrainerId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTrainer }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          Quant Finance & Prop Trading Assessment Benchmark
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Mental Math & Logic Drills for Quant Candidates
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Train under authentic Optiver, Akuna, and TraderMath interview conditions: 2-digit multiplication, 3-digit division, sequence logic, fractions & decimals.
        </p>

        {/* Feature Highlights Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> 1–10 Min Custom Timers
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" /> 3 Scaled Difficulty Tiers
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Tradermath Exact Off-by-One Distractors
          </span>
        </div>
      </section>

      {/* Trainer Cards Grid */}
      <section className="grid md:grid-cols-3 gap-6 pt-2">
        
        {/* Speed Arithmetic Card */}
        <div 
          onClick={() => onSelectTrainer('speed')}
          className="group bg-white border border-slate-200 hover:border-blue-600 rounded-xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Speed Arithmetic
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Multiplication (17×24), Division (528÷12), Squares (24²), Roots, and Percentages under timed pressure.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="font-mono text-slate-800 font-medium">Optiver / Akuna Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-mono text-slate-800 font-medium">4 Keypad / MCQ Options</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center font-semibold text-sm text-blue-600 group-hover:text-blue-700 gap-2">
            Start Speed Trainer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Number Logic Card */}
        <div 
          onClick={() => onSelectTrainer('sequence')}
          className="group bg-white border border-slate-200 hover:border-emerald-600 rounded-xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Brain className="w-5 h-5" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Number Logic
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Identify second-difference quadratic, interleaved dual series, Fibonacci, and recurrence patterns.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Pattern Types:</span>
                <span className="font-mono text-slate-800 font-medium">6 Advanced Series</span>
              </div>
              <div className="flex justify-between">
                <span>Explanations:</span>
                <span className="font-mono text-slate-800 font-medium">Step-by-Step Logic</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center font-semibold text-sm text-emerald-600 group-hover:text-emerald-700 gap-2">
            Start Logic Trainer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 80-in-8 Drill Card */}
        <div 
          onClick={() => onSelectTrainer('drill')}
          className="group bg-white border border-slate-200 hover:border-amber-600 rounded-xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Target className="w-5 h-5" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                80-in-8 Drill
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The flagship TraderMath assessment: 80 questions in 8 minutes featuring fractions, decimals & arithmetic.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Question Mix:</span>
                <span className="font-mono text-slate-800 font-medium">Decimals + Fractions + Math</span>
              </div>
              <div className="flex justify-between">
                <span>Scoring Rules:</span>
                <span className="font-mono text-slate-800 font-medium">+1 Correct / -1 Penalty</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center font-semibold text-sm text-amber-600 group-hover:text-amber-700 gap-2">
            Start 80-in-8 Drill
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

    </div>
  );
};
