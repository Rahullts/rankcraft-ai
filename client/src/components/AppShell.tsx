import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  Award,
  BookOpen,
  Menu,
  X,
  Cpu
} from 'lucide-react';
import { useStore } from '../state/store';

export const AppShell: React.FC = () => {
  const { state } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isMock = state.provider ? state.provider.provider === 'mock' : true;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/generate', label: 'Generate Package', icon: Sparkles },
    { to: '/lab', label: 'Prompt Lab', icon: FlaskConical },
    { to: '/evaluation', label: 'Evaluation & Rubric', icon: Award },
    { to: '/prompts', label: 'Prompts & Guide', icon: BookOpen }
  ];

  return (
    <div className="app-layout">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Persistent Mock Provider Demo Banner */}
      {isMock && (
        <aside className="mock-banner" role="status" aria-label="Demo provider notification">
          <div className="banner-content">
            <span className="banner-badge">DEMO MODE</span>
            <span className="banner-text">
              Running with <strong>Mock Provider</strong> (offline fixtures for academic evaluation & viva). Live Anthropic or OpenAI keys can be configured in <code>server/.env</code>.
            </span>
          </div>
        </aside>
      )}

      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} aria-label="Main Navigation">
          <div className="sidebar-header">
            <div className="brand">
              <div className="brand-icon-box">
                <Sparkles size={20} className="brand-icon-svg" />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">AI SEO</h1>
                <span className="brand-sub">Content Assistant</span>
              </div>
            </div>
            <button
              className="mobile-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="provider-card">
              <div className="provider-header">
                <Cpu size={14} />
                <span>Backend Provider</span>
              </div>
              <div className="provider-status-row">
                <span className={`status-dot ${isMock ? 'mock' : 'live'}`} />
                <span className="provider-name">
                  {state.provider ? state.provider.provider : 'Connecting...'}
                </span>
              </div>
              <div className="provider-model">
                Model: <code>{state.provider ? state.provider.model : 'default'}</code>
              </div>
            </div>
            <div className="academic-tag">
              Prompt Engineering Capstone · 35 Marks
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-wrapper">
          {/* Top Bar */}
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={22} />
              </button>
              <span className="page-breadcrumb">
                {navItems.find((n) => n.to === location.pathname)?.label || 'Workspace'}
              </span>
            </div>

            <div className="topbar-right">
              <div className="api-chip" title="Total API calls in this browser session">
                <span className="chip-label">Session Calls:</span>
                <span className="chip-value">{state.sessionCalls}</span>
              </div>
              <div className={`provider-chip ${isMock ? 'chip-mock' : 'chip-live'}`}>
                <span className={`chip-dot ${isMock ? 'dot-mock' : 'dot-live'}`} />
                <span>{state.provider ? state.provider.provider : 'offline'}</span>
              </div>
            </div>
          </header>

          {/* Main Outlet */}
          <main id="main-content" className="page-container" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
