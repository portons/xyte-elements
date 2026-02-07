import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  ExplorerView,
  ThemeId,
  ViewportPreset,
  WidgetControlSpec,
  XyteWidgetMode,
} from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import {
  getWidgetStory,
  WIDGET_CATEGORIES,
  WIDGET_STORIES,
} from '../widgets/registry';

// ── Category icons (SVG paths) ─────────────────────────────────────────
const CAT_ICONS: Record<string, string> = {
  Fleet: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  'AV Controls': 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  Audio: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  'Display & Routing': 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
  'Room & Climate': 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
  'Network & Infrastructure': 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  'Incidents & Logs': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  'Core Widgets': 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  'AI & Analytics': 'M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55C21.56 12.26 23 11.45 23 10c0-1.1-.9-2-2-2z',
  Collaboration: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  Energy: 'M7 2v11h3v9l7-12h-4l4-8z',
  Security: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  Signage: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z',
  Spatial: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  Mining: 'M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z',
  'Water Treatment': 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z',
  Robotics: 'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z',
  Nuclear: 'M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7.94 3c-.46 3.68-3.27 6.49-6.94 6.95V18h-2v1.95c-3.67-.46-6.49-3.27-6.94-6.95H6v-2H4.06c.46-3.68 3.27-6.49 6.94-6.95V6h2V4.05c3.67.46 6.49 3.27 6.94 6.95H18v2h1.94zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  Semiconductor: 'M15 21h2v-2h2v-2h-2v-2h2v-2h-2v-2h2V9h-2V7h2V5h-2V3h-2v2h-2V3h-2v2H9V3H7v2H5v2h2v2H5v2h2v2H5v2h2v2H5v2h2v2h2v-2h2v2h2v-2h2v2zm-4-4H9v-2h2v2zm0-4H9v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z',
  Railway: 'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm2 0V6h5v5h-5zm3.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  Brewing: 'M2 21h18v-2H2v2zM20 8h-2V5h2V3H4v2h2v3H4c-1.1 0-2 .9-2 2v5h20v-5c0-1.1-.9-2-2-2zm-6 0H8V5h6v3z',
  'Offshore Oil': 'M19.83 7.5l-2.27-2.27c.07-.42.18-.81.32-1.15.08-.18.12-.37.12-.58 0-.83-.67-1.5-1.5-1.5S15 2.67 15 3.5c0 .16.03.33.08.48.15.39.26.84.34 1.32l-2.27 2.27-.71-.71-1.06 1.06.71.71-3.39 3.39-.71-.71-1.06 1.06.71.71L5 15.71V22h6.29l2.63-2.63.71.71 1.06-1.06-.71-.71 3.39-3.39.71.71 1.06-1.06-.71-.71L21.83 12c1.1-1.1 1.1-2.9.01-4.01l-2.01-.49z',
  'Stadium & Events': 'M5 8c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm12 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-6.99-6C5.49 2 2 5.49 2 10.01S5.49 18 10.01 18H10v4h4v-4h-.01C18.51 18 22 14.51 22 10.01S18.51 2 14.01 2H10zm3.99 14H10c-3.31 0-6-2.69-6-6s2.69-6 6-6h4c3.31 0 6 2.69 6 6s-2.69 6-6 6z',
  'Space & Satellite': 'M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1zM21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66zm.26 1h-7.49l.29.5 4.76 8.25C21 16.97 22 14.61 22 12c0-.69-.07-1.35-.2-2zM8.54 12l-3.9-6.75C3.01 7.03 2 9.39 2 12c0 .69.07 1.35.2 2h7.49l-1.15-2zm-6.08 3c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46zm11.27 0l-3.9 6.76c.7.15 1.42.24 2.17.24 2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.93 1.6z',
};

// ── Props Panel Control ─────────────────────────────────────────────────
function PropControl({
  control,
  value,
  onChange,
}: {
  control: WidgetControlSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (control.kind === 'boolean') {
    const checked = Boolean(value);
    return (
      <div className="xe-prop">
        <div className="xe-prop__header">
          <span className="xe-prop__label">{control.label}</span>
          <span className="xe-prop__type">boolean</span>
        </div>
        <button
          type="button"
          className={`xe-toggle ${checked ? 'xe-toggle--on' : ''}`}
          onClick={() => onChange(!checked)}
          aria-pressed={checked}
        >
          <span className="xe-toggle__thumb" />
          <span className="xe-toggle__label">{checked ? 'true' : 'false'}</span>
        </button>
      </div>
    );
  }

  if (control.kind === 'number') {
    const min = control.min ?? 0;
    const max = control.max ?? 100;
    const step = control.step ?? 1;
    const num = typeof value === 'number' && Number.isFinite(value) ? value : min;
    const pct = ((num - min) / (max - min)) * 100;

    return (
      <div className="xe-prop">
        <div className="xe-prop__header">
          <span className="xe-prop__label">{control.label}</span>
          <span className="xe-prop__type">number</span>
        </div>
        <div className="xe-prop__slider-row">
          <input
            type="range"
            className="xe-range"
            min={min}
            max={max}
            step={step}
            value={num}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ '--pct': `${pct}%` } as React.CSSProperties}
          />
          <input
            type="number"
            className="xe-num-input"
            min={min}
            max={max}
            step={step}
            value={num}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) onChange(Math.max(min, Math.min(max, v)));
            }}
          />
        </div>
        <div className="xe-prop__range-info">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  const options = control.options ?? [];
  return (
    <div className="xe-prop">
      <div className="xe-prop__header">
        <span className="xe-prop__label">{control.label}</span>
        <span className="xe-prop__type">enum</span>
      </div>
      <div className="xe-chip-group">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`xe-chip ${String(value) === opt.value ? 'xe-chip--active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Zoom controls ───────────────────────────────────────────────────────
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface ExplorerPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  viewport: ViewportPreset;
  widgetId: string;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewportChange: (viewport: ViewportPreset) => void;
  onWidgetChange: (widgetId: string) => void;
  onViewChange: (view: ExplorerView) => void;
}

export function ExplorerPage({
  themeId,
  mode,
  viewport,
  widgetId,
  onThemeChange,
  onModeChange,
  onViewportChange,
  onWidgetChange,
  onViewChange,
}: ExplorerPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(WIDGET_CATEGORIES));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [propsCollapsed, setPropsCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bgPattern, setBgPattern] = useState<'dots' | 'grid' | 'none'>('dots');
  const [showCode, setShowCode] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportCopied, setExportCopied] = useState<string | null>(null);

  const selectedStory = getWidgetStory(widgetId);
  const [storyProps, setStoryProps] = useState<Record<string, unknown>>(selectedStory.defaultProps);
  const searchRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStoryProps(getWidgetStory(widgetId).defaultProps);
  }, [widgetId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      // [ and ] → prev/next widget
      if (e.key === '[' || e.key === ']') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        const stories = filteredStories;
        const idx = stories.findIndex((s) => s.id === widgetId);
        if (e.key === '[' && idx > 0) onWidgetChange(stories[idx - 1].id);
        if (e.key === ']' && idx < stories.length - 1) onWidgetChange(stories[idx + 1].id);
      }
      // + / - → zoom
      if ((e.key === '=' || e.key === '+') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom((z) => Math.min(2, z + 0.25));
      }
      if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom((z) => Math.max(0.5, z - 0.25));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [widgetId, search]);

  const filteredStories = useMemo(
    () =>
      WIDGET_STORIES.filter((story) => {
        const searchLower = search.toLowerCase();
        return (
          story.title.toLowerCase().includes(searchLower) ||
          story.id.toLowerCase().includes(searchLower) ||
          story.category.toLowerCase().includes(searchLower)
        );
      }),
    [search],
  );

  const storiesByCategory = useMemo(() => {
    const map = new Map<string, typeof filteredStories>();
    for (const story of filteredStories) {
      const arr = map.get(story.category) || [];
      arr.push(story);
      map.set(story.category, arr);
    }
    return map;
  }, [filteredStories]);

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const canvasClass = [
    'xe-canvas',
    viewport === 'mobile' ? 'xe-canvas--mobile' : '',
    `xe-canvas--bg-${bgPattern}`,
  ]
    .filter(Boolean)
    .join(' ');

  const propsCode = useMemo(() => {
    const entries = Object.entries(storyProps);
    if (entries.length === 0) return `<${selectedStory.title.replace(/\s+/g, '')} />`;
    const propsStr = entries
      .map(([k, v]) => {
        if (typeof v === 'string') return `  ${k}="${v}"`;
        if (typeof v === 'boolean') return v ? `  ${k}` : `  ${k}={false}`;
        return `  ${k}={${JSON.stringify(v)}}`;
      })
      .join('\n');
    return `<${selectedStory.title.replace(/\s+/g, '')}\n${propsStr}\n/>`;
  }, [storyProps, selectedStory]);

  const jsonConfig = useMemo(() => JSON.stringify({
    widget: selectedStory.id,
    props: storyProps,
    theme: themeId,
    mode,
  }, null, 2), [selectedStory, storyProps, themeId, mode]);

  const embedCode = useMemo(() => {
    const params = new URLSearchParams();
    params.set('view', 'explorer');
    params.set('widget', selectedStory.id);
    params.set('theme', themeId);
    params.set('mode', mode);
    return `<iframe src="${window.location.origin}${window.location.pathname}?${params.toString()}"\n  width="500" height="400" frameborder="0"\n  style="border-radius: 8px; border: 1px solid #333;" />`;
  }, [selectedStory, themeId, mode]);

  const reactImport = useMemo(() => {
    const compName = selectedStory.title.replace(/\s+/g, '');
    const entries = Object.entries(storyProps);
    if (entries.length === 0) return `import { ${compName} } from '@xyte/elements';\n\n<${compName} />`;
    const propsStr = entries
      .map(([k, v]) => {
        if (typeof v === 'string') return `  ${k}="${v}"`;
        if (typeof v === 'boolean') return v ? `  ${k}` : `  ${k}={false}`;
        return `  ${k}={${JSON.stringify(v)}}`;
      })
      .join('\n');
    return `import { ${compName} } from '@xyte/elements';\n\n<${compName}\n${propsStr}\n/>`;
  }, [selectedStory, storyProps]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setExportCopied(label);
    setTimeout(() => setExportCopied(null), 1500);
  }, []);

  const downloadPng = useCallback(() => {
    const el = canvasRef.current?.querySelector('[data-widget-root]') as HTMLElement | null;
    if (!el) return;
    // Use canvas API to screenshot
    import('html-to-image').then(({ toPng }) => {
      toPng(el, { backgroundColor: 'transparent' }).then((dataUrl) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${selectedStory.id}-${themeId}.png`;
        a.click();
      });
    }).catch(() => {
      // Fallback: copy raw SVG-like approach not available, show message
      alert('PNG export requires the html-to-image package. Run: npm i html-to-image');
    });
  }, [selectedStory, themeId]);

  const totalCount = WIDGET_STORIES.length;
  const filteredCount = filteredStories.length;

  return (
    <div className="xe-shell" data-theme={themeId} data-mode={mode}>
      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <header className="xe-topbar">
        <div className="xe-topbar__left">
          <button className="xe-nav-btn" type="button" onClick={() => onViewChange('dashboard')} title="Dashboard view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
          </button>
          <button className="xe-nav-btn" type="button" onClick={() => onViewChange('gallery')} title="Gallery view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" /></svg>
          </button>
          <div className="xe-topbar__divider" />
          <span className="xe-topbar__brand">XYTE Elements</span>
          <span className="xe-topbar__count">{filteredCount === totalCount ? totalCount : `${filteredCount} / ${totalCount}`} widgets</span>
        </div>

        <div className="xe-topbar__center">
          <div className="xe-breadcrumb">
            <span className="xe-breadcrumb__cat">{selectedStory.category}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
            <span className="xe-breadcrumb__name">{selectedStory.title}</span>
          </div>
        </div>

        <div className="xe-topbar__right">
          <select
            className="xe-select"
            value={themeId}
            onChange={(e) => onThemeChange(e.target.value as ThemeId)}
            title="Theme"
          >
            {XYTE_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div className="xe-segmented">
            <button type="button" className={mode === 'modern' ? 'active' : ''} onClick={() => onModeChange('modern')}>Modern</button>
            <button type="button" className={mode === 'legacy' ? 'active' : ''} onClick={() => onModeChange('legacy')}>Legacy</button>
          </div>
          <div className="xe-segmented">
            <button type="button" className={viewport === 'desktop' ? 'active' : ''} onClick={() => onViewportChange('desktop')} title="Desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" /></svg>
            </button>
            <button type="button" className={viewport === 'mobile' ? 'active' : ''} onClick={() => onViewportChange('mobile')} title="Mobile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="xe-body">
        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <aside className={`xe-sidebar ${sidebarCollapsed ? 'xe-sidebar--collapsed' : ''}`}>
          <div className="xe-sidebar__header">
            {!sidebarCollapsed && (
              <div className="xe-search">
                <svg className="xe-search__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  className="xe-search__input"
                  placeholder="Search widgets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                />
                {search && (
                  <button type="button" className="xe-search__clear" onClick={() => setSearch('')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                  </button>
                )}
                <kbd className="xe-search__kbd">&#8984;K</kbd>
              </div>
            )}
            <button
              type="button"
              className="xe-sidebar__toggle"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : undefined, transition: 'transform 200ms ease' }}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          </div>

          {!sidebarCollapsed && (
            <nav className="xe-tree" role="tree">
              {WIDGET_CATEGORIES.map((cat) => {
                const stories = storiesByCategory.get(cat);
                if (!stories || stories.length === 0) return null;
                const isExpanded = expandedCats.has(cat);
                const hasActive = stories.some((s) => s.id === widgetId);

                return (
                  <div key={cat} className={`xe-tree__group ${hasActive ? 'xe-tree__group--has-active' : ''}`}>
                    <button
                      type="button"
                      className="xe-tree__cat"
                      onClick={() => toggleCategory(cat)}
                      aria-expanded={isExpanded}
                    >
                      <svg
                        className="xe-tree__chevron"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : undefined }}
                      >
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                      </svg>
                      <svg className="xe-tree__cat-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d={CAT_ICONS[cat] || CAT_ICONS.Fleet} />
                      </svg>
                      <span className="xe-tree__cat-label">{cat}</span>
                      <span className="xe-tree__cat-count">{stories.length}</span>
                    </button>
                    {isExpanded && (
                      <div className="xe-tree__items">
                        {stories.map((story) => (
                          <button
                            key={story.id}
                            type="button"
                            className={`xe-tree__item ${story.id === widgetId ? 'xe-tree__item--active' : ''}`}
                            onClick={() => onWidgetChange(story.id)}
                          >
                            <span className="xe-tree__item-dot" />
                            <span>{story.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </aside>

        {/* ── MAIN CANVAS ────────────────────────────────────────────── */}
        <main className="xe-main">
          <div className="xe-canvas-toolbar">
            <div className="xe-canvas-toolbar__left">
              <h2 className="xe-widget-title">{selectedStory.title}</h2>
              <code className="xe-widget-id">{selectedStory.id}</code>
              <span className="xe-widget-cat-badge">{selectedStory.category}</span>
            </div>
            <div className="xe-canvas-toolbar__right">
              <div className="xe-bg-switcher">
                {(['dots', 'grid', 'none'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={bgPattern === p ? 'active' : ''}
                    onClick={() => setBgPattern(p)}
                    title={`Background: ${p}`}
                  >
                    {p === 'dots' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="3" cy="3" r="1" fill="currentColor" /><circle cx="9" cy="3" r="1" fill="currentColor" /><circle cx="3" cy="9" r="1" fill="currentColor" /><circle cx="9" cy="9" r="1" fill="currentColor" /></svg>
                    ) : p === 'grid' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M0 6h12M6 0v12" stroke="currentColor" strokeWidth="0.5" fill="none" /><rect width="12" height="12" stroke="currentColor" strokeWidth="0.5" fill="none" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12"><rect width="12" height="12" rx="2" fill="currentColor" opacity="0.3" /></svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="xe-zoom">
                <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} disabled={zoom <= 0.5} title="Zoom out">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>
                </button>
                <button type="button" className="xe-zoom__value" onClick={() => setZoom(1)} title="Reset zoom">
                  {Math.round(zoom * 100)}%
                </button>
                <button type="button" onClick={() => setZoom((z) => Math.min(2, z + 0.25))} disabled={zoom >= 2} title="Zoom in">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                </button>
              </div>
              <button
                type="button"
                className={`xe-code-btn ${showCode ? 'xe-code-btn--active' : ''}`}
                onClick={() => setShowCode((v) => !v)}
                title="Toggle code view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
              </button>
              <div className="xe-export-wrap">
                <button
                  type="button"
                  className={`xe-code-btn ${showExport ? 'xe-code-btn--active' : ''}`}
                  onClick={() => setShowExport((v) => !v)}
                  title="Export options"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
                </button>
                {showExport && (
                  <div className="xe-export-dropdown">
                    <button type="button" onClick={() => copyToClipboard(jsonConfig, 'json')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
                      {exportCopied === 'json' ? 'Copied!' : 'Copy JSON Config'}
                    </button>
                    <button type="button" onClick={() => copyToClipboard(reactImport, 'react')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
                      {exportCopied === 'react' ? 'Copied!' : 'Copy React Snippet'}
                    </button>
                    <button type="button" onClick={() => copyToClipboard(embedCode, 'embed')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg>
                      {exportCopied === 'embed' ? 'Copied!' : 'Copy Embed Code'}
                    </button>
                    <button type="button" onClick={downloadPng}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                      Download PNG
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={canvasClass} ref={canvasRef}>
            <div
              className="xe-canvas__stage"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
            >
              <div
                data-widget-root
                data-widget-id={selectedStory.id}
                data-mode={mode}
                data-theme={themeId}
                className={`xe-widget-wrap ${viewport === 'mobile' ? 'xe-widget-wrap--mobile' : ''}`}
              >
                {selectedStory.render(storyProps)}
              </div>
            </div>
          </div>

          {showCode && (
            <div className="xe-code-panel">
              <div className="xe-code-panel__header">
                <span>Usage</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(propsCode);
                  }}
                  title="Copy"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                </button>
              </div>
              <pre className="xe-code-panel__code"><code>{propsCode}</code></pre>
            </div>
          )}
        </main>

        {/* ── PROPS PANEL ─────────────────────────────────────────────── */}
        <aside className={`xe-props ${propsCollapsed ? 'xe-props--collapsed' : ''}`}>
          <div className="xe-props__header">
            {!propsCollapsed && <h3>Properties</h3>}
            <button
              type="button"
              className="xe-props__toggle"
              onClick={() => setPropsCollapsed((v) => !v)}
              title={propsCollapsed ? 'Expand props' : 'Collapse props'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ transform: propsCollapsed ? 'rotate(180deg)' : undefined, transition: 'transform 200ms ease' }}>
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </div>

          {!propsCollapsed && (
            <div className="xe-props__body">
              {selectedStory.controls.length === 0 ? (
                <div className="xe-props__empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                  <p>No configurable props</p>
                  <p className="xe-props__empty-sub">This widget uses default configuration</p>
                </div>
              ) : (
                <>
                  <div className="xe-props__controls">
                    {selectedStory.controls.map((control) => (
                      <PropControl
                        key={control.key}
                        control={control}
                        value={storyProps[control.key]}
                        onChange={(v) => setStoryProps((prev) => ({ ...prev, [control.key]: v }))}
                      />
                    ))}
                  </div>
                  <div className="xe-props__actions">
                    <button
                      type="button"
                      className="xe-reset-btn"
                      onClick={() => setStoryProps(selectedStory.defaultProps)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
                      Reset to defaults
                    </button>
                  </div>
                </>
              )}

              {/* Quick info section */}
              <div className="xe-props__info">
                <div className="xe-props__info-row">
                  <span className="xe-props__info-label">Widget ID</span>
                  <code className="xe-props__info-value">{selectedStory.id}</code>
                </div>
                <div className="xe-props__info-row">
                  <span className="xe-props__info-label">Category</span>
                  <span className="xe-props__info-value">{selectedStory.category}</span>
                </div>
                <div className="xe-props__info-row">
                  <span className="xe-props__info-label">Mode</span>
                  <span className="xe-props__info-value">{selectedStory.defaultMode}</span>
                </div>
                <div className="xe-props__info-row">
                  <span className="xe-props__info-label">Props</span>
                  <span className="xe-props__info-value">{selectedStory.controls.length} configurable</span>
                </div>
              </div>

              {/* Keyboard shortcuts */}
              <div className="xe-shortcuts">
                <h4>Shortcuts</h4>
                <div className="xe-shortcuts__row"><kbd>[</kbd> <kbd>]</kbd> <span>Prev / Next widget</span></div>
                <div className="xe-shortcuts__row"><kbd>&#8984;K</kbd> <span>Search</span></div>
                <div className="xe-shortcuts__row"><kbd>&#8984;+</kbd> <kbd>&#8984;-</kbd> <span>Zoom</span></div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
