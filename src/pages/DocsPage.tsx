import { useMemo, useState } from 'react';

import type {
  ExplorerView,
  ThemeId,
  ViewportPreset,
  XyteWidgetMode,
} from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import { WIDGET_STORIES } from '../widgets/registry';
import { buildDocsIndex } from '../docs/model';

interface DocsPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  viewport: ViewportPreset;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewportChange: (viewport: ViewportPreset) => void;
  onViewChange: (view: ExplorerView) => void;
  onWidgetSelect: (widgetId: string) => void;
}

const DOC_SECTIONS = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'theming', label: 'Theming' },
  { id: 'widget-catalog', label: 'Widget Catalog' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'faq', label: 'FAQ' },
];

export function DocsPage({
  themeId,
  mode,
  viewport,
  onThemeChange,
  onModeChange,
  onViewportChange,
  onViewChange,
  onWidgetSelect,
}: DocsPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const docsIndex = useMemo(() => buildDocsIndex(WIDGET_STORIES), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const filteredWidgets = useMemo(() => {
    const q = query.trim().toLowerCase();

    return docsIndex.widgets.filter((widget) => {
      if (category !== 'all' && widget.category !== category) return false;
      if (!q) return true;
      return widget.searchableText.includes(q);
    });
  }, [docsIndex.widgets, query, category]);

  const buildExplorerHref = (widgetId: string) => {
    const params = new URLSearchParams();
    params.set('view', 'explorer');
    params.set('widget', widgetId);
    params.set('theme', themeId);
    params.set('mode', mode);
    params.set('viewport', viewport);
    return `${window.location.pathname}?${params.toString()}`;
  };

  const openInExplorer = (widgetId: string) => {
    onWidgetSelect(widgetId);
    onViewChange('explorer');
  };

  return (
    <div className="xd-shell" data-theme={themeId} data-mode={mode}>
      <header className="xd-topbar">
        <div className="xd-brand">
          <span className="xd-brand__name">XYTE Elements Docs</span>
          <span className="xd-brand__meta">{docsIndex.stats.widgetCount} widgets</span>
        </div>

        <nav className="xd-nav" aria-label="Docs navigation">
          <button type="button" className="xd-nav__btn" onClick={() => onViewChange('landing')}>Landing</button>
          <button type="button" className="xd-nav__btn xd-nav__btn--active">Docs</button>
          <button type="button" className="xd-nav__btn" onClick={() => onViewChange('gallery')}>Gallery</button>
          <button type="button" className="xd-nav__btn" onClick={() => onViewChange('explorer')}>Explorer</button>
        </nav>

        <div className="xd-controls">
          <select
            className="xd-select"
            value={themeId}
            onChange={(event) => onThemeChange(event.target.value as ThemeId)}
            title="Theme"
          >
            {XYTE_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          <div className="xd-segmented" role="group" aria-label="Mode">
            <button type="button" className={mode === 'modern' ? 'active' : ''} onClick={() => onModeChange('modern')}>Modern</button>
            <button type="button" className={mode === 'legacy' ? 'active' : ''} onClick={() => onModeChange('legacy')}>Legacy</button>
          </div>

          <div className="xd-segmented" role="group" aria-label="Viewport">
            <button type="button" className={viewport === 'desktop' ? 'active' : ''} onClick={() => onViewportChange('desktop')}>Desktop</button>
            <button type="button" className={viewport === 'mobile' ? 'active' : ''} onClick={() => onViewportChange('mobile')}>Mobile</button>
          </div>
        </div>
      </header>

      <div className="xd-layout">
        <aside className="xd-aside">
          <p className="xd-aside__title">Sections</p>
          <nav className="xd-anchor-nav">
            {DOC_SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`}>{section.label}</a>
            ))}
          </nav>
        </aside>

        <main className="xd-main">
          <section id="getting-started" className="xd-section">
            <h1>Getting Started</h1>
            <p>
              This docs hub is generated from the in-repo widget registry so teams can verify
              defaults and control contracts before integrating UI surfaces.
            </p>
            <pre className="xd-code">
{`npm install
npm run dev
npm run typecheck
npm run build`}
            </pre>
          </section>

          <section id="architecture" className="xd-section">
            <h2>Architecture</h2>
            <p>Core implementation references:</p>
            <ul className="xd-list">
              <li><code>/Users/porton/Projects/xyte-elements/src/widgets</code> widget implementations.</li>
              <li><code>/Users/porton/Projects/xyte-elements/src/widgets/registry.ts</code> story metadata and controls.</li>
              <li><code>/Users/porton/Projects/xyte-elements/src/theme/themes.ts</code> runtime themes and tokens.</li>
            </ul>
          </section>

          <section id="theming" className="xd-section">
            <h2>Theming</h2>
            <p>
              Themes are token-driven and passed to widgets via runtime theme hooks. Current preset
              count: <strong>{docsIndex.stats.themeCount}</strong>.
            </p>
            <div className="xd-token-grid">
              {docsIndex.themeNames.slice(0, 12).map((themeName) => (
                <div key={themeName} className="xd-token-chip">{themeName}</div>
              ))}
            </div>
          </section>

          <section id="widget-catalog" className="xd-section">
            <h2>Widget Catalog</h2>
            <p>
              {docsIndex.stats.widgetCount} widgets across {docsIndex.stats.categoryCount} categories.
            </p>
            <div className="xd-category-grid">
              {docsIndex.categoriesBySize.map((item) => (
                <article key={item.category} className="xd-category-card">
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </article>
              ))}
            </div>
          </section>

          <section id="api-reference" className="xd-section">
            <div className="xd-section__header">
              <h2>API Reference</h2>
              <p>{filteredWidgets.length} widgets shown</p>
            </div>

            <div className="xd-filters">
              <label className="xd-field">
                <span>Search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="id, title, category, control key..."
                  spellCheck={false}
                />
              </label>
              <label className="xd-field">
                <span>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="all">All categories</option>
                  {docsIndex.categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="xd-api-list">
              {filteredWidgets.map((widget) => (
                <details key={widget.id} className="xd-api-item">
                  <summary>
                    <div className="xd-api-item__title">
                      <strong>{widget.title}</strong>
                      <code>{widget.id}</code>
                    </div>
                    <div className="xd-api-item__meta">
                      <span>{widget.category}</span>
                      <span>default mode: {widget.defaultMode}</span>
                      <button
                        type="button"
                        className="xd-open-btn"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openInExplorer(widget.id);
                        }}
                      >
                        Open in Explorer
                      </button>
                      <a
                        href={buildExplorerHref(widget.id)}
                        className="xd-permalink"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Permalink
                      </a>
                    </div>
                  </summary>

                  <div className="xd-api-item__body">
                    <div>
                      <h3>Default Props</h3>
                      <pre className="xd-code">{widget.defaultPropsJson}</pre>
                    </div>

                    <div>
                      <h3>Controls</h3>
                      {widget.controls.length === 0 ? (
                        <p className="xd-muted">No controls defined for this widget.</p>
                      ) : (
                        <table className="xd-table">
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Label</th>
                              <th>Kind</th>
                              <th>Range</th>
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {widget.controls.map((control) => (
                              <tr key={control.key}>
                                <td><code>{control.key}</code></td>
                                <td>{control.label}</td>
                                <td>{control.kind}</td>
                                <td>{control.rangeLabel}</td>
                                <td>{control.optionsLabel}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section id="faq" className="xd-section">
            <h2>FAQ</h2>
            <div className="xd-faq">
              <article>
                <h3>Is this published as an npm package?</h3>
                <p>No. This is currently a repo-local internal UI library and playground.</p>
              </article>
              <article>
                <h3>Where do API docs come from?</h3>
                <p>API docs are generated from registry metadata in <code>src/widgets/registry.ts</code>.</p>
              </article>
              <article>
                <h3>How do I inspect behavior changes quickly?</h3>
                <p>Open Explorer for live controls and Gallery for broad visual comparisons.</p>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
