/**
 * Sidebar Navigation Component for RankCraft AI.
 * Supports collapsible state, active tab indicators, and clean icon-like glyphs.
 */

import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  historyCount: number;
  openHistory: () => void;
  openApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  historyCount,
  openHistory,
  openApiKeyModal,
  hasApiKey
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '📊', desc: 'System status & metrics' },
    { id: 'generator', label: 'SEO Content Studio', icon: '✍️', desc: '12-part content generator' },
    { id: 'prompt-lab', label: 'Prompt Engineering Lab', icon: '🧪', desc: 'Mode A vs Mode B comparison', badge: 'Core' },
    { id: 'evaluation', label: 'Heuristic Evaluation', icon: '🎯', desc: '0-5 rubric scoring' },
  ];

  return (
    <aside
      className={`sidebar flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
              R
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  RankCraft<span className="text-blue-600">.AI</span>
                </span>
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Academic Project
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl p-3 text-left transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <div className="ml-3 overflow-hidden pr-2">
                    <div className="text-sm flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-blue-800 text-blue-200'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`block text-[11px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Utilities */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* History Button */}
        <button
          onClick={openHistory}
          className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Generation History"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">🗂️</span>
            {!collapsed && <span className="text-sm font-medium">Session History</span>}
          </div>
          {!collapsed && (
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold">
              {historyCount}
            </span>
          )}
        </button>

        {/* API Key Status / Config */}
        <button
          onClick={openApiKeyModal}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-colors ${
            hasApiKey
              ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
              : 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
          }`}
          title="API Key Configuration"
        >
          <span className="text-lg flex-shrink-0">{hasApiKey ? '🟢' : '🔑'}</span>
          {!collapsed && (
            <div className="text-xs leading-tight overflow-hidden">
              <span className="font-semibold block truncate">
                {hasApiKey ? 'Live AI Mode' : 'Configure API Key'}
              </span>
              <span className="text-[10px] opacity-80 block truncate">
                {hasApiKey ? 'Gemini 1.5 Active' : 'Demo / Pending'}
              </span>
            </div>
          )}
        </button>

        {!collapsed && (
          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              v1.0 • 35-Mark Academic Edition
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
