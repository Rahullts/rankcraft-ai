/**
 * Session History Drawer Component for RankCraft AI.
 * Persists generation runs in browser localStorage, allowing one-click reloading,
 * inspection, and cleanup.
 */

import React from 'react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🗂️</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Session History
              </h3>
              <span className="text-[11px] text-slate-400">
                {history.length} Saved Generations (Local Storage)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Clear all saved history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-3xl mb-2">📂</div>
              <p className="text-xs">No generations saved in this session yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.prompt_mode === 'improved'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.prompt_mode === 'improved' ? 'Mode B' : 'Mode A'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.result.recommended_title.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    KW: "{item.inputs.primary_keyword}"
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Score: {item.evaluation.overall_score}% ({item.evaluation.letter_grade.split(' ')[0]})
                    </span>
                    <span className="text-slate-400">
                      {item.evaluation.metrics.draft_word_count} words
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete item"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
