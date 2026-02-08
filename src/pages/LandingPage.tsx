import { useMemo } from 'react';

import type { ExplorerView, ThemeId, XyteWidgetMode } from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import { WIDGET_STORIES } from '../widgets/registry';
import { buildDocsIndex } from '../docs/model';

interface LandingPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewChange: (view: ExplorerView) => void;
}

const FEATURE_PILLARS = [
  {
    title: 'Deep Widget Coverage',
    body: 'Operational widgets across AV, infrastructure, industrial, healthcare, security, and more.',
  },
  {
    title: 'Themeable Runtime',
    body: 'Consistent token-driven visuals across dark, light, and domain-focused themes.',
  },
  {
    title: 'Live Controls',
    body: 'Explore runtime props, control metadata, and state variations in the built-in Explorer.',
  },
  {
    title: 'Implementation-Ready Docs',
    body: 'Registry-driven API reference for defaults, controls, and usage paths without drift.',
  },
];

export function LandingPage({
  themeId,
  mode,
  onThemeChange,
  onModeChange,
  onViewChange,
}: LandingPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const docsIndex = useMemo(() => buildDocsIndex(WIDGET_STORIES), []);
  const topCategories = docsIndex.categoriesBySize.slice(0, 12);

  return (
    <div className="xl-shell" data-theme={themeId} data-mode={mode}>
      <header className="xl-topbar">
        <div className="xl-brand">
          <span className="xl-brand__name">XYTE Elements</span>
          <span className="xl-brand__meta">Internal Design System</span>
        </div>

        <nav className="xl-nav" aria-label="Primary">
          <button type="button" className="xl-nav__btn xl-nav__btn--active">Landing</button>
          <button type="button" className="xl-nav__btn" onClick={() => onViewChange('docs')}>Docs</button>
          <button type="button" className="xl-nav__btn" onClick={() => onViewChange('dashboard')}>Dashboard</button>
          <button type="button" className="xl-nav__btn" onClick={() => onViewChange('gallery')}>Gallery</button>
          <button type="button" className="xl-nav__btn" onClick={() => onViewChange('explorer')}>Explorer</button>
        </nav>

        <div className="xl-controls">
          <select
            className="xl-select"
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

          <div className="xl-segmented" role="group" aria-label="Mode">
            <button
              type="button"
              className={mode === 'modern' ? 'active' : ''}
              onClick={() => onModeChange('modern')}
            >
              Modern
            </button>
            <button
              type="button"
              className={mode === 'legacy' ? 'active' : ''}
              onClick={() => onModeChange('legacy')}
            >
              Legacy
            </button>
          </div>
        </div>
      </header>

      <main className="xl-main">
        <section className="xl-hero">
          <p className="xl-eyebrow">Widget Platform</p>
          <h1>Build operational interfaces with a consistent XYTE UI surface.</h1>
          <p className="xl-copy">
            XYTE Elements centralizes reusable widgets, theme tokens, and control contracts for
            internal product teams. Use it to prototype quickly and ship production-consistent UI.
          </p>
          <div className="xl-hero__actions">
            <button type="button" className="xl-cta xl-cta--primary" onClick={() => onViewChange('docs')}>Open Docs</button>
            <button type="button" className="xl-cta" onClick={() => onViewChange('explorer')}>Open Explorer</button>
            <button type="button" className="xl-cta" onClick={() => onViewChange('gallery')}>Open Gallery</button>
          </div>
        </section>

        <section className="xl-stats" aria-label="Library Metrics">
          <article className="xl-stat">
            <span className="xl-stat__label">Widgets</span>
            <strong>{docsIndex.stats.widgetCount}</strong>
          </article>
          <article className="xl-stat">
            <span className="xl-stat__label">Categories</span>
            <strong>{docsIndex.stats.categoryCount}</strong>
          </article>
          <article className="xl-stat">
            <span className="xl-stat__label">Themes</span>
            <strong>{docsIndex.stats.themeCount}</strong>
          </article>
          <article className="xl-stat">
            <span className="xl-stat__label">Modes</span>
            <strong>{docsIndex.stats.modeCount}</strong>
          </article>
        </section>

        <section className="xl-section">
          <div className="xl-section__header">
            <h2>What this library gives teams</h2>
          </div>
          <div className="xl-pillars">
            {FEATURE_PILLARS.map((pillar) => (
              <article key={pillar.title} className="xl-pillar">
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="xl-section">
          <div className="xl-section__header">
            <h2>Top widget categories</h2>
            <button type="button" className="xl-link-btn" onClick={() => onViewChange('docs')}>
              View full API
            </button>
          </div>
          <div className="xl-categories">
            {topCategories.map((category) => (
              <article key={category.category} className="xl-category">
                <span>{category.category}</span>
                <strong>{category.count}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="xl-section">
          <div className="xl-section__header">
            <h2>Quick start</h2>
          </div>
          <pre className="xl-code" aria-label="Quick start commands">
{`npm install
npm run dev
npm run typecheck
npm run build`}
          </pre>
        </section>

        <section className="xl-bottom-cta">
          <h2>Ready to inspect props and controls?</h2>
          <p>Use the docs hub for contracts, then jump straight into Explorer for live behavior.</p>
          <div className="xl-bottom-cta__actions">
            <button type="button" className="xl-cta xl-cta--primary" onClick={() => onViewChange('docs')}>Go to Docs</button>
            <button type="button" className="xl-cta" onClick={() => onViewChange('explorer')}>Go to Explorer</button>
          </div>
        </section>
      </main>
    </div>
  );
}
