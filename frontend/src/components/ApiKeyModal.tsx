/**
 * API Key Configuration Modal for RankCraft AI.
 * Enables users and faculty to review environment key status, enter a Gemini API key,
 * test connectivity, or switch to Academic Demonstration mode.
 */

import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  maskedKey: string;
  onSaveKey: (key: string) => Promise<boolean>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasApiKey,
  maskedKey,
  onSaveKey
}) => {
  const [inputKey, setInputKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setFeedback({ type: 'error', message: 'API key cannot be empty.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const ok = await onSaveKey(inputKey.trim());
      if (ok) {
        setFeedback({ type: 'success', message: 'Gemini API Key saved and verified successfully!' });
        setInputKey('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: 'Failed to save API key. Please check your network or server logs.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred while saving the key.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🔑</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Google Gemini API Configuration
              </h3>
              <span className="text-[11px] text-slate-400">
                Secure Server-Side AI Integration
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Current Key Status Card */}
        <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
          hasApiKey
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span>Status: {hasApiKey ? '🟢 Live API Active' : '🟡 Academic Demo Mode Active'}</span>
            <span className="font-mono">{maskedKey}</span>
          </div>
          <p className="opacity-90 leading-relaxed">
            {hasApiKey
              ? 'Real server-side API requests are enabled with Google Gemini 1.5 Flash.'
              : 'No API key detected in .env. The system is operating in offline Academic Demonstration mode with realistic baseline datasets.'}
          </p>
        </div>

        {/* Instructions to get key */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <strong className="text-slate-800 dark:text-slate-200 block">
            How to get a Free Google Gemini API Key:
          </strong>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">Google AI Studio</a>.</li>
            <li>Click <strong>"Create API Key"</strong> (Free tier available).</li>
            <li>Copy your key and paste it below, or add <code>GEMINI_API_KEY="your-key"</code> to the <code>.env</code> file.</li>
          </ol>
        </div>

        {/* Form to submit key */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter / Update Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              🔒 Key is sent over encrypted local loopback and stored strictly server-side in <code>.env</code>.
            </span>
          </div>

          {feedback && (
            <div className={`p-3 rounded-lg text-xs font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {feedback.message}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Activate Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
