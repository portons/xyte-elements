import { useMemo, useState } from 'react';

import type { ExplorerView, ThemeId, XyteWidgetMode } from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import { WIDGET_CATEGORIES, WIDGET_STORIES } from '../widgets/registry';

const ZOOM_OPTIONS = [0.6, 0.8, 1, 1.25, 1.5];

interface GalleryPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewChange: (view: ExplorerView) => void;
  onWidgetSelect: (widgetId: string) => void;
}

export function GalleryPage({
  themeId,
  mode,
  onThemeChange,
  onModeChange,
  onViewChange,
  onWidgetSelect,
}: GalleryPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const [zoom, setZoom] = useState(0.8);
  const [search, setSearch] = useState('');
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      WIDGET_STORIES.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }),
    [search],
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const s of filtered) {
      const arr = map.get(s.category) || [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [filtered]);

  const toggleCat = (cat: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleWidgetClick = (id: string) => {
    onWidgetSelect(id);
    onViewChange('explorer');
  };

  return (
    <div className="xg-shell" data-theme={themeId} data-mode={mode}>
      {/* Toolbar */}
      <header className="xg-toolbar">
        <div className="xg-toolbar__left">
          <button className="xg-back-btn" type="button" onClick={() => onViewChange('landing')} title="Landing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          </button>
          <button className="xg-back-btn" type="button" onClick={() => onViewChange('docs')} title="Docs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h11V2zm-2 14H8V4h9v12zM5 6H3v14c0 1.1.9 2 2 2h12v-2H5V6z" /></svg>
          </button>
          <button className="xg-back-btn" type="button" onClick={() => onViewChange('dashboard')} title="Back to Dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
          </button>
          <button className="xg-back-btn" type="button" onClick={() => onViewChange('explorer')} title="Explorer (single widget)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
          </button>
          <div className="xg-toolbar__divider" />
          <span className="xg-toolbar__title">Gallery</span>
          <span className="xg-toolbar__count">{filtered.length} widgets</span>
        </div>

        <div className="xg-toolbar__center">
          <input
            type="text"
            className="xg-search"
            placeholder="Filter widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="xg-toolbar__right">
          <select
            className="xg-select"
            value={themeId}
            onChange={(e) => onThemeChange(e.target.value as ThemeId)}
          >
            {XYTE_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div className="xg-segmented">
            <button type="button" className={mode === 'modern' ? 'active' : ''} onClick={() => onModeChange('modern')}>Modern</button>
            <button type="button" className={mode === 'legacy' ? 'active' : ''} onClick={() => onModeChange('legacy')}>Legacy</button>
          </div>
          <div className="xg-zoom">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))} disabled={zoom <= 0.6}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>
            </button>
            <button type="button" className="xg-zoom__val" onClick={() => setZoom(0.8)}>
              {Math.round(zoom * 100)}%
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.2).toFixed(1)))} disabled={zoom >= 1.5}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Gallery grid */}
      <main className="xg-body">
        {WIDGET_CATEGORIES.map((cat) => {
          const stories = byCategory.get(cat);
          if (!stories || stories.length === 0) return null;
          const collapsed = collapsedCats.has(cat);

          return (
            <section key={cat} className="xg-category">
              <button
                type="button"
                className="xg-category__header"
                onClick={() => toggleCat(cat)}
              >
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                  style={{ transform: collapsed ? 'rotate(-90deg)' : undefined, transition: 'transform 150ms ease' }}
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
                <span className="xg-category__name">{cat}</span>
                <span className="xg-category__count">{stories.length}</span>
              </button>

              {!collapsed && (
                <div className="xg-grid" style={{ '--xg-zoom': zoom } as React.CSSProperties}>
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="xg-cell"
                      onClick={() => handleWidgetClick(story.id)}
                      title={`${story.title} — click to open in Explorer`}
                    >
                      <div className="xg-cell__label">
                        <span className="xg-cell__title">{story.title}</span>
                        <code className="xg-cell__id">{story.id}</code>
                      </div>
                      <div
                        className="xg-cell__widget"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                      >
                        {story.render(story.defaultProps)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
