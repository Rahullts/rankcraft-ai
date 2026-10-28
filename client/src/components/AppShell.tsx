import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  Award,
  BookOpen,
  Menu,
  X,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../state/store';

export const AppShell: React.FC = () => {
  const { state } = useStore();
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    try {
      return localStorage.getItem('rankcraft_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
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

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setDesktopCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('rankcraft_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Automatically reset mobile drawer when resizing back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  return (
    <div className={`app-layout ${desktopCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Persistent Mock Provider Demo Banner (Compact & Responsive) */}
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

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="app-body">
        {/* Sidebar */}
        <aside
          id="main-sidebar"
          className={`sidebar ${desktopCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
          aria-label="Main Navigation"
        >
          <div className="sidebar-header">
            <div className="brand" title="AI SEO Content Assistant">
              <div className="brand-icon-box">
                <Sparkles size={20} className="brand-icon-svg" />
              </div>
              {!desktopCollapsed && (
                <div className="brand-text">
                  <h1 className="brand-title">AI SEO</h1>
                  <span className="brand-sub">Content Assistant</span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              className="mobile-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>

            {/* Desktop collapse button */}
            <button
              type="button"
              className="desktop-collapse-btn"
              onClick={toggleSidebar}
              aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {desktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
                  title={desktopCollapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  <Icon size={18} className="nav-icon" />
                  {!desktopCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            {!desktopCollapsed ? (
              <>
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
              </>
            ) : (
              <div
                className="provider-card-collapsed"
                title={`Backend: ${state.provider?.provider || 'mock'} (${state.provider?.model || 'default'})`}
              >
                <span className={`status-dot ${isMock ? 'mock' : 'live'}`} />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-wrapper">
          {/* Top Bar */}
          <header className="topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu size={20} />
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
