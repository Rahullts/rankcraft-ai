/**
 * Main Application Component for RankCraft AI.
 * Orchestrates navigation, global state, API communication, local storage history,
 * notifications, and theme management.
 */

import React, { useState, useEffect } from 'react';
import {
  GenerationInput,
  SeoContentResult,
  ContentEvaluation,
  PromptMode,
  HistoryItem,
  PromptLabResponse
} from './types';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { ContentGenerator } from './components/ContentGenerator';
import { ResultsView } from './components/ResultsView';
import { PromptLab } from './components/PromptLab';
import { ContentEvaluationView } from './components/ContentEvaluation';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DocumentationModal } from './components/DocumentationModal';

const HISTORY_STORAGE_KEY = 'rankcraft_history_v1';
const THEME_STORAGE_KEY = 'rankcraft_theme_v1';

export const App: React.FC = () => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved ? saved === 'dark' : false;
  });

  // System Backend Status
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('CHECKING...');
  const [activeModel, setActiveModel] = useState<string>('gemini-1.5-flash');

  // Generation & Form States
  const [currentInputs, setCurrentInputs] = useState<GenerationInput>({
    topic: 'Cloud Database Performance Optimization',
    primary_keyword: 'database performance',
    target_audience: 'Backend Developers & DevOps Engineers',
    industry: 'Cloud Infrastructure & SaaS',
    target_country: 'Global / United States',
    secondary_keywords: 'query latency, connection pooling, b-tree indexing, postgresql optimization',
    search_intent: 'Informational',
    content_type: 'Comprehensive Guide',
    tone: 'Authoritative & Actionable',
    language: 'English (US)',
    target_word_count: 1200,
    reference_material: 'Highlight p99 latency vs averages, PgBouncer pool sizing formula, and covering index examples.',
    prompt_mode: 'improved'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<SeoContentResult | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<ContentEvaluation | null>(null);
  const [promptModeUsed, setPromptModeUsed] = useState<PromptMode>('improved');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Lab A/B State
  const [labData, setLabData] = useState<PromptLabResponse | null>(null);
  const [labLoading, setLabLoading] = useState<boolean>(false);

  // Notification Toast State
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [darkMode]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Fetch backend status probe on initial load
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setHasApiKey(data.has_api_key);
        setMaskedKey(data.masked_key);
        setActiveModel(data.active_model || 'gemini-1.5-flash');
      }
    } catch (err) {
      console.warn('Backend server not yet ready:', err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Content Generation Handler
  const handleGenerate = async (inputs: GenerationInput) => {
    setLoading(true);
    setNotification(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate content from AI model.');
      }

      setGenerationResult(data.content);
      setCurrentEvaluation(data.evaluation);
      setPromptModeUsed(data.prompt_mode);
      setIsDemoMode(data.is_demo_mode);

      // Save to local history
      const newHistoryItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        inputs: { ...inputs },
        prompt_mode: data.prompt_mode,
        result: data.content,
        evaluation: data.evaluation
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]);

      showNotification(
        data.is_demo_mode
          ? 'Generated successfully (Academic Demonstration Mode).'
          : 'Content generated successfully via Google Gemini API!',
        'success'
      );
    } catch (err: any) {
      console.error('Generation error:', err);
      showNotification(err.message || 'Generation failed. Check server status.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Prompt Lab A/B Runner
  const handleRunComparison = async (inputs: GenerationInput): Promise<PromptLabResponse | null> => {
    setLabLoading(true);
    try {
      const res = await fetch('/api/prompt-lab/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute A/B comparison experiment.');
      }

      setLabData(data);
      showNotification(
        `A/B Test Complete! Prompt Engineering delivered a +${data.comparison.overall_delta} pt improvement.`,
        'success'
      );
      return data;
    } catch (err: any) {
      console.error('Prompt Lab error:', err);
      showNotification(err.message || 'Comparison failed.', 'error');
      return null;
    } finally {
      setLabLoading(false);
    }
  };

  // Save API Key Handler
  const handleSaveApiKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await checkStatus();
        showNotification('Gemini API Key activated successfully!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Restore session from history
  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentInputs(item.inputs);
    setGenerationResult(item.result);
    setCurrentEvaluation(item.evaluation);
    setPromptModeUsed(item.prompt_mode);
    setActiveTab('generator');
    showNotification(`Restored session from ${new Date(item.timestamp).toLocaleTimeString()}`, 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    showNotification('Session history cleared.', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        historyCount={history.length}
        openHistory={() => setHistoryOpen(true)}
        openApiKeyModal={() => setApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          hasApiKey={hasApiKey}
          activeModel={activeModel}
          openApiKeyModal={() => setApiKeyModalOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openDocModal={() => setDocModalOpen(true)}
        />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-bounce">
            <div
              className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center space-x-2 ${
                notification.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : notification.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              <span>{notification.type === 'success' ? '✓' : notification.type === 'error' ? '⚠️' : 'ℹ️'}</span>
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          {activeTab === 'dashboard' && (
            <DashboardHome
              setActiveTab={setActiveTab}
              openApiKeyModal={() => setApiKeyModalOpen(true)}
              hasApiKey={hasApiKey}
              historyCount={history.length}
            />
          )}

          {activeTab === 'generator' && (
            <div className="space-y-10">
              <ContentGenerator
                onGenerate={handleGenerate}
                loading={loading}
                currentInputs={currentInputs}
                setCurrentInputs={setCurrentInputs}
                hasApiKey={hasApiKey}
                openApiKeyModal={() => setApiKeyModalOpen(true)}
              />

              {generationResult && (
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <ResultsView
                    content={generationResult}
                    inputs={currentInputs}
                    evaluation={currentEvaluation || undefined}
                    promptMode={promptModeUsed}
                    isDemoMode={isDemoMode}
                    onOpenEvaluation={() => setActiveTab('evaluation')}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'prompt-lab' && (
            <PromptLab
              currentInputs={currentInputs}
              onRunComparison={handleRunComparison}
              labData={labData}
              loading={labLoading}
            />
          )}

          {activeTab === 'evaluation' && (
            <ContentEvaluationView
              evaluation={currentEvaluation}
              inputs={currentInputs}
              onNavigateToGenerator={() => setActiveTab('generator')}
            />
          )}
        </main>
      </div>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        hasApiKey={hasApiKey}
        maskedKey={maskedKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />
    </div>
  );
};
