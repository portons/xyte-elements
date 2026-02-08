import React from 'react';
import { useEffect, useMemo, useState } from 'react';

import type {
  ExplorerView,
  ThemeId,
  ViewportPreset,
  XyteWidgetMode,
} from './explorer/types';
import { DashboardPage } from './pages/DashboardPage';
import { DocsPage } from './pages/DocsPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { GalleryPage } from './pages/GalleryPage';
import { LandingPage } from './pages/LandingPage';
import { XYTE_THEME_IDS } from './theme/themes';
import { getWidgetStory } from './widgets/registry';

import './styles/base.css';
import './styles/themes.css';
import './styles/components.css';
import './styles/site.css';

interface AppState {
  view: ExplorerView;
  themeId: ThemeId;
  mode: XyteWidgetMode;
  widgetId: string;
  viewport: ViewportPreset;
}

const DEFAULT_STATE: AppState = {
  view: 'landing',
  themeId: 'xyte_classic_dark',
  mode: 'modern',
  widgetId: 'kpi',
  viewport: 'desktop',
};

const VIEW_IDS: ExplorerView[] = ['landing', 'docs', 'dashboard', 'gallery', 'explorer'];

function parseStateFromSearch(search: string): AppState {
  const params = new URLSearchParams(search);

  const viewParam = params.get('view');
  const view: ExplorerView = VIEW_IDS.includes(viewParam as ExplorerView)
    ? (viewParam as ExplorerView)
    : DEFAULT_STATE.view;
  const themeCandidate = params.get('theme') as ThemeId | null;
  const themeId = XYTE_THEME_IDS.includes(themeCandidate as ThemeId)
    ? (themeCandidate as ThemeId)
    : DEFAULT_STATE.themeId;
  const mode = params.get('mode') === 'legacy' ? 'legacy' : 'modern';
  const viewport = params.get('viewport') === 'mobile' ? 'mobile' : 'desktop';
  const widgetCandidate = params.get('widget') ?? DEFAULT_STATE.widgetId;
  let widgetId: string;
  try {
    widgetId = getWidgetStory(widgetCandidate).id;
  } catch {
    widgetId = DEFAULT_STATE.widgetId;
  }

  return { view, themeId, mode, widgetId, viewport };
}

function writeStateToUrl(state: AppState) {
  const params = new URLSearchParams(window.location.search);
  params.set('view', state.view);
  params.set('theme', state.themeId);
  params.set('mode', state.mode);
  params.set('widget', state.widgetId);
  params.set('viewport', state.viewport);
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', next);
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('[App] crash:', error, info.componentStack); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f14', color: '#ccc', fontFamily: 'system-ui', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#dc2626' }}>Something went wrong</span>
          <code style={{ fontSize: 12, color: '#888', maxWidth: 500, textAlign: 'center' }}>{this.state.error?.message}</code>
          <button type="button" onClick={() => { this.setState({ hasError: false, error: null }); }} style={{ marginTop: 8, padding: '6px 16px', borderRadius: 6, border: '1px solid #444', background: '#1a1a24', color: '#ccc', cursor: 'pointer', fontSize: 13 }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const initialState = useMemo(
    () => parseStateFromSearch(window.location.search),
    [],
  );

  const [view, setView] = useState<ExplorerView>(initialState.view);
  const [themeId, setThemeId] = useState<ThemeId>(initialState.themeId);
  const [mode, setMode] = useState<XyteWidgetMode>(initialState.mode);
  const [widgetId, setWidgetId] = useState<string>(initialState.widgetId);
  const [viewport, setViewport] = useState<ViewportPreset>(initialState.viewport);

  useEffect(() => {
    writeStateToUrl({ view, themeId, mode, widgetId, viewport });
  }, [view, themeId, mode, widgetId, viewport]);

  return (
    <AppErrorBoundary>
    <div className="xyte-app" data-theme={themeId}>
      {view === 'landing' ? (
        <LandingPage
          themeId={themeId}
          mode={mode}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewChange={setView}
        />
      ) : view === 'docs' ? (
        <DocsPage
          themeId={themeId}
          mode={mode}
          viewport={viewport}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewportChange={setViewport}
          onViewChange={setView}
          onWidgetSelect={setWidgetId}
        />
      ) : view === 'dashboard' ? (
        <DashboardPage
          themeId={themeId}
          mode={mode}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewChange={setView}
        />
      ) : view === 'gallery' ? (
        <GalleryPage
          themeId={themeId}
          mode={mode}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewChange={setView}
          onWidgetSelect={setWidgetId}
        />
      ) : (
        <ExplorerPage
          themeId={themeId}
          mode={mode}
          viewport={viewport}
          widgetId={widgetId}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewportChange={setViewport}
          onWidgetChange={setWidgetId}
          onViewChange={setView}
        />
      )}
    </div>
    </AppErrorBoundary>
  );
}
