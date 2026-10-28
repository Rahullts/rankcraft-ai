/**
 * Application Entrypoint for RankCraft AI.
 * Renders the top-level React component tree into the root DOM node.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element '#root' not found in DOM.");
}
