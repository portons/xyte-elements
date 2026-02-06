import { useEffect, useMemo, useState } from 'react';

import type {
  ExplorerView,
  ThemeId,
  ViewportPreset,
  XyteWidgetMode,
} from './explorer/types';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { XYTE_THEME_IDS } from './theme/themes';
import { getWidgetStory } from './widgets/registry';

import './styles/base.css';
import './styles/themes.css';
import './styles/components.css';

interface AppState {
  view: ExplorerView;
  themeId: ThemeId;
  mode: XyteWidgetMode;
  widgetId: string;
  viewport: ViewportPreset;
}

const DEFAULT_STATE: AppState = {
  view: 'dashboard',
  themeId: 'xyte_classic_dark',
  mode: 'modern',
  widgetId: 'kpi',
  viewport: 'desktop',
};

function parseStateFromSearch(search: string): AppState {
  const params = new URLSearchParams(search);

  const view = params.get('view') === 'explorer' ? 'explorer' : 'dashboard';
  const themeCandidate = params.get('theme') as ThemeId | null;
  const themeId = XYTE_THEME_IDS.includes(themeCandidate as ThemeId)
    ? (themeCandidate as ThemeId)
    : DEFAULT_STATE.themeId;
  const mode = params.get('mode') === 'legacy' ? 'legacy' : 'modern';
  const viewport = params.get('viewport') === 'mobile' ? 'mobile' : 'desktop';
  const widgetCandidate = params.get('widget') ?? DEFAULT_STATE.widgetId;
  const widgetId = getWidgetStory(widgetCandidate).id;

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
    <div className="xyte-app" data-theme={themeId}>
      {view === 'dashboard' ? (
        <DashboardPage
          themeId={themeId}
          mode={mode}
          onThemeChange={setThemeId}
          onModeChange={setMode}
          onViewChange={setView}
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
  );
}
