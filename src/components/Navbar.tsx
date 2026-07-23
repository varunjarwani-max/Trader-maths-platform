import React from 'react';
import { PageTab } from '../types';
import { Zap, Brain, Target, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'speed', label: 'Speed Arithmetic', icon: <Zap className="w-4 h-4" /> },
    { id: 'sequence', label: 'Number Logic', icon: <Brain className="w-4 h-4" /> },
    { id: 'drill', label: '80-in-8 Drill', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#0F172A] text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md p-1 transition-all"
        >
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-mono font-bold text-white shadow-sm group-hover:bg-blue-500 transition-colors">
            TM
          </div>
          <div className="text-left">
            <span className="font-semibold tracking-tight text-white text-base block leading-none">
              TraderMath
            </span>
            <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase leading-none mt-1 block">
              Quant Prep
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
