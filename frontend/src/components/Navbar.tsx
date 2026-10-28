/**
 * Top Navigation Header for RankCraft AI.
 * Displays system status, active model, key setup trigger, and dark/light theme switch.
 */

import React from 'react';

interface NavbarProps {
  hasApiKey: boolean;
  activeModel: string;
  openApiKeyModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openDocModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasApiKey,
  activeModel,
  openApiKeyModal,
  darkMode,
  setDarkMode,
  openDocModal
}) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline">
            Project:
          </span>
          <h1 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[280px] sm:max-w-md">
            AI SEO Content Assistant Using Prompt Engineering
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Model Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
          <span>⚡</span>
          <span>{activeModel}</span>
        </div>

        {/* Status Pill */}
        <button
          onClick={openApiKeyModal}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            hasApiKey
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse'
          }`}
          title="Click to configure Gemini API Key"
        >
          <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{hasApiKey ? 'Live AI Connected' : 'Demo Mode (No API Key)'}</span>
        </button>

        {/* Academic Documentation Button */}
        <button
          onClick={openDocModal}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          title="Academic Viva & Project Documentation"
        >
          📖 <span className="hidden lg:inline text-xs font-medium ml-1">Documentation</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
