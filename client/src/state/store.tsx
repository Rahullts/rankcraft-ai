import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import {
  SeoInput,
  PackageRun,
  SimpleRun,
  StageId,
  ProviderHealth
} from './types';
import { evaluate } from '../lib/evaluate';
import { api } from '../api/client';

export const DEFAULT_INPUT: SeoInput = {
  topic: '',
  audience: '',
  industry: '',
  market: '',
  primaryKeyword: '',
  intent: 'informational',
  tone: 'professional',
  language: 'English',
  wordCount: 800
};

export const SAMPLE_INPUT: SeoInput = {
  topic: 'Growing herbs at home',
  audience: 'Beginner home cooks',
  industry: 'Home and garden',
  market: 'United Kingdom',
  primaryKeyword: 'indoor herb garden',
  intent: 'informational',
  tone: 'professional',
  language: 'English',
  wordCount: 800
};

interface State {
  input: SeoInput;
  provider: ProviderHealth | null;
  pipelineRunning: boolean;
  currentStage: StageId | null;
  currentPackage: PackageRun | null;
  labSimpleRun: SimpleRun | null;
  labImprovedRun: PackageRun | null;
  labRunning: boolean;
  error: string | null;
  sessionCalls: number;
}

type Action =
  | { type: 'SET_INPUT'; payload: Partial<SeoInput> }
  | { type: 'SET_PROVIDER'; payload: ProviderHealth }
  | { type: 'START_PIPELINE' }
  | { type: 'SET_STAGE'; payload: StageId }
  | { type: 'UPDATE_PACKAGE'; payload: Partial<PackageRun> }
  | { type: 'FINISH_PIPELINE'; payload: PackageRun }
  | { type: 'CANCEL_PIPELINE' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MANUAL_REVIEW'; payload: { source: 'package' | 'simple' | 'improved'; intent?: number; tone?: number } }
  | { type: 'START_LAB' }
  | { type: 'FINISH_LAB'; payload: { simple: SimpleRun; improved: PackageRun } }
  | { type: 'INCREMENT_CALLS' };

const STORAGE_KEY_PACKAGE = 'seo.latestRun';
const STORAGE_KEY_LAB = 'seo.labRuns';

function loadInitialState(): State {
  let savedPackage: PackageRun | null = null;
  let savedLabSimple: SimpleRun | null = null;
  let savedLabImproved: PackageRun | null = null;

  try {
    const pkgRaw = localStorage.getItem(STORAGE_KEY_PACKAGE);
    if (pkgRaw) {
      savedPackage = JSON.parse(pkgRaw);
      if (savedPackage && savedPackage.input && savedPackage.articleMarkdown) {
        savedPackage.evaluation = evaluate('package', {
          input: savedPackage.input,
          strategy: savedPackage.strategy,
          outline: savedPackage.outline,
          articleMarkdown: savedPackage.articleMarkdown,
          faqs: savedPackage.faqs,
          manualReview: savedPackage.manualReview
        });
      }
    }

    const labRaw = localStorage.getItem(STORAGE_KEY_LAB);
    if (labRaw) {
      const parsed = JSON.parse(labRaw);
      savedLabSimple = parsed.simple || null;
      savedLabImproved = parsed.improved || null;

      if (savedLabSimple && savedLabSimple.input && savedLabSimple.articleMarkdown) {
        savedLabSimple.evaluation = evaluate('article', {
          input: savedLabSimple.input,
          articleMarkdown: savedLabSimple.articleMarkdown,
          manualReview: savedLabSimple.manualReview
        });
      }
      if (savedLabImproved && savedLabImproved.input && savedLabImproved.articleMarkdown) {
        savedLabImproved.evaluation = evaluate('package', {
          input: savedLabImproved.input,
          strategy: savedLabImproved.strategy,
          outline: savedLabImproved.outline,
          articleMarkdown: savedLabImproved.articleMarkdown,
          faqs: savedLabImproved.faqs,
          manualReview: savedLabImproved.manualReview
        });
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }

  return {
    input: savedPackage?.input || DEFAULT_INPUT,
    provider: null,
    pipelineRunning: false,
    currentStage: null,
    currentPackage: savedPackage,
    labSimpleRun: savedLabSimple,
    labImprovedRun: savedLabImproved,
    labRunning: false,
    error: null,
    sessionCalls: 0
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: { ...state.input, ...action.payload } };

    case 'SET_PROVIDER':
      return { ...state, provider: action.payload };

    case 'START_PIPELINE':
      return {
        ...state,
        pipelineRunning: true,
        currentStage: 'strategy',
        error: null
      };

    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };

    case 'UPDATE_PACKAGE':
      return {
        ...state,
        currentPackage: state.currentPackage ? { ...state.currentPackage, ...action.payload } : (action.payload as PackageRun)
      };

    case 'FINISH_PIPELINE': {
      try {
        localStorage.setItem(STORAGE_KEY_PACKAGE, JSON.stringify(action.payload));
      } catch (e) {
        console.warn('Could not persist package to localStorage', e);
      }
      return {
        ...state,
        pipelineRunning: false,
        currentStage: 'done',
        currentPackage: action.payload
      };
    }

    case 'CANCEL_PIPELINE':
      return {
        ...state,
        pipelineRunning: false,
        currentStage: null,
        error: 'Generation cancelled by user.'
      };

    case 'SET_ERROR':
      return { ...state, pipelineRunning: false, labRunning: false, error: action.payload };

    case 'START_LAB':
      return { ...state, labRunning: true, error: null };

    case 'FINISH_LAB': {
      try {
        localStorage.setItem(
          STORAGE_KEY_LAB,
          JSON.stringify({ simple: action.payload.simple, improved: action.payload.improved })
        );
      } catch (e) {
        console.warn('Could not persist lab run to localStorage', e);
      }
      return {
        ...state,
        labRunning: false,
        labSimpleRun: action.payload.simple,
        labImprovedRun: action.payload.improved
      };
    }

    case 'SET_MANUAL_REVIEW': {
      const { source, intent, tone } = action.payload;
      if (source === 'package' && state.currentPackage) {
        const updatedReview = {
          intentMatch: intent !== undefined ? intent : state.currentPackage.manualReview.intentMatch,
          toneAudienceFit: tone !== undefined ? tone : state.currentPackage.manualReview.toneAudienceFit
        };
        const evalResult = evaluate('package', {
          input: state.currentPackage.input,
          strategy: state.currentPackage.strategy,
          outline: state.currentPackage.outline,
          articleMarkdown: state.currentPackage.articleMarkdown || '',
          faqs: state.currentPackage.faqs,
          manualReview: updatedReview
        });
        const updatedPackage: PackageRun = {
          ...state.currentPackage,
          manualReview: updatedReview,
          evaluation: evalResult
        };
        try {
          localStorage.setItem(STORAGE_KEY_PACKAGE, JSON.stringify(updatedPackage));
        } catch {}
        return { ...state, currentPackage: updatedPackage };
      }

      if (source === 'simple' && state.labSimpleRun) {
        const updatedReview = {
          intentMatch: intent !== undefined ? intent : state.labSimpleRun.manualReview.intentMatch,
          toneAudienceFit: tone !== undefined ? tone : state.labSimpleRun.manualReview.toneAudienceFit
        };
        const evalResult = evaluate('article', {
          input: state.labSimpleRun.input,
          articleMarkdown: state.labSimpleRun.articleMarkdown,
          manualReview: updatedReview
        });
        const updatedSimple: SimpleRun = {
          ...state.labSimpleRun,
          manualReview: updatedReview,
          evaluation: evalResult
        };
        try {
          localStorage.setItem(
            STORAGE_KEY_LAB,
            JSON.stringify({ simple: updatedSimple, improved: state.labImprovedRun })
          );
        } catch {}
        return { ...state, labSimpleRun: updatedSimple };
      }

      if (source === 'improved' && state.labImprovedRun) {
        const updatedReview = {
          intentMatch: intent !== undefined ? intent : state.labImprovedRun.manualReview.intentMatch,
          toneAudienceFit: tone !== undefined ? tone : state.labImprovedRun.manualReview.toneAudienceFit
        };
        const evalResult = evaluate('package', {
          input: state.labImprovedRun.input,
          strategy: state.labImprovedRun.strategy,
          outline: state.labImprovedRun.outline,
          articleMarkdown: state.labImprovedRun.articleMarkdown || '',
          faqs: state.labImprovedRun.faqs,
          manualReview: updatedReview
        });
        const updatedImproved: PackageRun = {
          ...state.labImprovedRun,
          manualReview: updatedReview,
          evaluation: evalResult
        };
        try {
          localStorage.setItem(
            STORAGE_KEY_LAB,
            JSON.stringify({ simple: state.labSimpleRun, improved: updatedImproved })
          );
        } catch {}
        return { ...state, labImprovedRun: updatedImproved };
      }

      return state;
    }

    case 'INCREMENT_CALLS':
      return { ...state, sessionCalls: state.sessionCalls + 1 };

    default:
      return state;
  }
}

interface StoreContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  setInput: (input: Partial<SeoInput>) => void;
  loadExampleInput: () => void;
  runPipeline: (input?: SeoInput) => Promise<void>;
  cancelPipeline: () => void;
  runLabComparison: (input?: SeoInput) => Promise<void>;
  setManualReview: (source: 'package' | 'simple' | 'improved', intent?: number, tone?: number) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

let activeAbortController: AbortController | null = null;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null, loadInitialState);

  // Poll provider health on mount
  useEffect(() => {
    let unmounted = false;
    api
      .getHealth()
      .then((health) => {
        if (!unmounted) dispatch({ type: 'SET_PROVIDER', payload: health });
      })
      .catch((err) => {
        console.error('Provider health fetch failed', err);
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const setInput = (input: Partial<SeoInput>) => {
    dispatch({ type: 'SET_INPUT', payload: input });
  };

  const loadExampleInput = () => {
    dispatch({ type: 'SET_INPUT', payload: SAMPLE_INPUT });
  };

  const cancelPipeline = () => {
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    dispatch({ type: 'CANCEL_PIPELINE' });
  };

  const runPipeline = async (overrideInput?: SeoInput) => {
    const inputToUse = overrideInput || state.input;
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;

    dispatch({ type: 'START_PIPELINE' });
    const startTime = Date.now();
    const stageMetas: Record<string, any> = {};

    try {
      // Stage 1: Strategy
      dispatch({ type: 'SET_STAGE', payload: 'strategy' });
      dispatch({ type: 'INCREMENT_CALLS' });
      const stratRes = await api.generateStrategy(inputToUse, signal);
      stageMetas.strategy = stratRes.meta;

      // Stage 2: Outline
      dispatch({ type: 'SET_STAGE', payload: 'outline' });
      dispatch({ type: 'INCREMENT_CALLS' });
      const outlineRes = await api.generateOutline(inputToUse, stratRes.data, signal);
      stageMetas.outline = outlineRes.meta;

      // Stage 3: Article
      dispatch({ type: 'SET_STAGE', payload: 'article' });
      dispatch({ type: 'INCREMENT_CALLS' });
      const articleRes = await api.generateArticle(inputToUse, stratRes.data, outlineRes.data, signal);
      stageMetas.article = articleRes.meta;

      // Stage 4: FAQs
      dispatch({ type: 'SET_STAGE', payload: 'faqs' });
      dispatch({ type: 'INCREMENT_CALLS' });
      const faqsRes = await api.generateFaqs(inputToUse, stratRes.data, outlineRes.data, signal);
      stageMetas.faqs = faqsRes.meta;

      // Stage 5: Checklist / Evaluation
      dispatch({ type: 'SET_STAGE', payload: 'checklist' });
      const evalResult = evaluate('package', {
        input: inputToUse,
        strategy: stratRes.data,
        outline: outlineRes.data,
        articleMarkdown: articleRes.data.markdown,
        faqs: faqsRes.data.faqs,
        manualReview: { intentMatch: undefined, toneAudienceFit: undefined }
      });

      const totalDuration = Date.now() - startTime;
      const completedPackage: PackageRun = {
        id: `pkg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        input: inputToUse,
        strategy: stratRes.data,
        outline: outlineRes.data,
        articleMarkdown: articleRes.data.markdown,
        faqs: faqsRes.data.faqs,
        evaluation: evalResult,
        manualReview: {},
        meta: {
          totalDurationMs: totalDuration,
          isMock: Boolean((stratRes.meta as any).isMock ?? (stratRes.meta as any).mock ?? (stratRes.meta?.provider === 'mock')),
          stages: stageMetas
        }
      };

      dispatch({ type: 'FINISH_PIPELINE', payload: completedPackage });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        dispatch({ type: 'CANCEL_PIPELINE' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: err.message || 'Pipeline failed' });
      }
    } finally {
      activeAbortController = null;
    }
  };

  const runLabComparison = async (overrideInput?: SeoInput) => {
    const inputToUse = overrideInput || state.input;
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;

    dispatch({ type: 'START_LAB' });
    const startTime = Date.now();
    const stageMetas: Record<string, any> = {};

    try {
      // 1. Run Simple Prompt Baseline
      dispatch({ type: 'INCREMENT_CALLS' });
      const simpleRes = await api.generateSimple(inputToUse, signal);
      const simpleEval = evaluate('article', {
        input: inputToUse,
        articleMarkdown: simpleRes.data.markdown,
        manualReview: {}
      });
      const simpleRun: SimpleRun = {
        id: `simple-${Date.now()}`,
        timestamp: new Date().toISOString(),
        input: inputToUse,
        articleMarkdown: simpleRes.data.markdown,
        evaluation: simpleEval,
        manualReview: {},
        meta: simpleRes.meta
      };

      // 2. Run Staged Improved Pipeline
      dispatch({ type: 'INCREMENT_CALLS' });
      const stratRes = await api.generateStrategy(inputToUse, signal);
      stageMetas.strategy = stratRes.meta;

      dispatch({ type: 'INCREMENT_CALLS' });
      const outlineRes = await api.generateOutline(inputToUse, stratRes.data, signal);
      stageMetas.outline = outlineRes.meta;

      dispatch({ type: 'INCREMENT_CALLS' });
      const articleRes = await api.generateArticle(inputToUse, stratRes.data, outlineRes.data, signal);
      stageMetas.article = articleRes.meta;

      dispatch({ type: 'INCREMENT_CALLS' });
      const faqsRes = await api.generateFaqs(inputToUse, stratRes.data, outlineRes.data, signal);
      stageMetas.faqs = faqsRes.meta;

      const improvedEval = evaluate('package', {
        input: inputToUse,
        strategy: stratRes.data,
        outline: outlineRes.data,
        articleMarkdown: articleRes.data.markdown,
        faqs: faqsRes.data.faqs,
        manualReview: {}
      });

      const improvedRun: PackageRun = {
        id: `improved-${Date.now()}`,
        timestamp: new Date().toISOString(),
        input: inputToUse,
        strategy: stratRes.data,
        outline: outlineRes.data,
        articleMarkdown: articleRes.data.markdown,
        faqs: faqsRes.data.faqs,
        evaluation: improvedEval,
        manualReview: {},
        meta: {
          totalDurationMs: Date.now() - startTime,
          isMock: Boolean((stratRes.meta as any).isMock ?? (stratRes.meta as any).mock ?? (stratRes.meta?.provider === 'mock')),
          stages: stageMetas
        }
      };

      dispatch({ type: 'FINISH_LAB', payload: { simple: simpleRun, improved: improvedRun } });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        dispatch({ type: 'SET_ERROR', payload: 'Comparison cancelled by user.' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: err.message || 'Lab comparison failed' });
      }
    } finally {
      activeAbortController = null;
    }
  };

  const setManualReview = (source: 'package' | 'simple' | 'improved', intent?: number, tone?: number) => {
    dispatch({ type: 'SET_MANUAL_REVIEW', payload: { source, intent, tone } });
  };

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setInput,
      loadExampleInput,
      runPipeline,
      cancelPipeline,
      runLabComparison,
      setManualReview
    }),
    [state]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
