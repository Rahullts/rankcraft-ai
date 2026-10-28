import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './state/store';
import { AppShell } from './components/AppShell';
import { Dashboard } from './routes/Dashboard';
import { Generate } from './routes/Generate';
import { Lab } from './routes/Lab';
import { Evaluation } from './routes/Evaluation';
import { Prompts } from './routes/Prompts';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="generate" element={<Generate />} />
            <Route path="lab" element={<Lab />} />
            <Route path="evaluation" element={<Evaluation />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};
