import { useMemo, useState, useEffect, useRef, useCallback } from 'react';

import type { ExplorerView, ThemeId, XyteWidgetMode } from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import { WIDGET_STORIES } from '../widgets/registry';
import { buildDocsIndex } from '../docs/model';

// Live widgets for hero + strip
import { Gauge } from '../widgets/fleet';
import { SolarPanel } from '../widgets/energy';
import { Speedometer } from '../widgets/automotive';
import { Chronograph } from '../widgets/watchmaking';
import { AnomalyDetector } from '../widgets/ai-analytics';
import { ReactorStatus } from '../widgets/nuclear';
import { StatusIndicator } from '../widgets/core-widgets';

// Primitives
import { XyteLogo } from '../widgets/primitives';

interface LandingPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewChange: (view: ExplorerView) => void;
}

// --- Internal helpers ---

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

const BASE_URL = import.meta.env.BASE_URL || '/';

// --- Inline SVG icons for tool cards ---

function IconExplorer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <rect x="14" y="3" width="7" height="8" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconDocs() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

function IconGallery() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="7" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

// --- Section components ---

function HeroSection({
  docsIndex,
  onViewChange,
}: {
  docsIndex: ReturnType<typeof buildDocsIndex>;
  onViewChange: (view: ExplorerView) => void;
}) {
  return (
    <section className="xl-hero">
      <div className="xl-hero-split">
        <div className="xl-hero-text">
          <p className="xl-eyebrow" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            XYTE_ELEMENTS // v1.0
          </p>
          <h1 className="xl-si" style={{ animationDelay: '0.05s' }}>
            {docsIndex.stats.widgetCount} operational widgets.{' '}
            <span style={{ opacity: 0.6 }}>One control surface.</span>
          </h1>
          <p className="xl-copy xl-si" style={{ animationDelay: '0.15s' }}>
            A private design library for XYTE product teams. Themeable, controllable,
            registry-driven UI components for dashboards, operational interfaces,
            and monitoring surfaces.
          </p>
          <div className="xl-hero__actions xl-si" style={{ animationDelay: '0.25s' }}>
            <button type="button" className="xl-cta xl-cta--primary" onClick={() => onViewChange('explorer')}>
              Open Explorer
            </button>
            <button type="button" className="xl-cta" onClick={() => onViewChange('docs')}>
              Browse Docs
            </button>
          </div>
        </div>
        <div className="xl-hero-composition">
          <div
            className="xl-hero-composition__bg"
            style={{ backgroundImage: `url(${BASE_URL}assets/hero-banner.jpg)` }}
          />
          <div className="xl-hero-widget xl-hero-widget--1 xl-si" style={{ animationDelay: '0.3s' }}>
            <Gauge value={78} max={100} label="SYS" unit="%" size={88} />
          </div>
          <div className="xl-hero-widget xl-hero-widget--2 xl-si" style={{ animationDelay: '0.45s' }}>
            <SolarPanel output={4.8} daily={28.4} efficiency={21.3} />
          </div>
          <div className="xl-hero-widget xl-hero-widget--3 xl-si" style={{ animationDelay: '0.6s' }}>
            <StatusIndicator value="Online" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsRail({ docsIndex }: { docsIndex: ReturnType<typeof buildDocsIndex> }) {
  const widgets = useCountUp(docsIndex.stats.widgetCount);
  const categories = useCountUp(docsIndex.stats.categoryCount);
  const themes = useCountUp(docsIndex.stats.themeCount);
  const modes = useCountUp(docsIndex.stats.modeCount);

  return (
    <div className="xl-stats-rail xl-si" style={{ animationDelay: '0.2s' }}>
      <div className="xl-stats-rail__item">
        <span className="xl-stats-rail__number">{widgets}</span>
        <span className="xl-stats-rail__label">Widgets</span>
      </div>
      <div className="xl-stats-rail__item">
        <span className="xl-stats-rail__number">{categories}</span>
        <span className="xl-stats-rail__label">Categories</span>
      </div>
      <div className="xl-stats-rail__item">
        <span className="xl-stats-rail__number">{themes}</span>
        <span className="xl-stats-rail__label">Themes</span>
      </div>
      <div className="xl-stats-rail__item">
        <span className="xl-stats-rail__number">{modes}</span>
        <span className="xl-stats-rail__label">Modes</span>
      </div>
    </div>
  );
}

function CategoryMarquee({
  categories,
  onViewChange,
}: {
  categories: { category: string; count: number }[];
  onViewChange: (view: ExplorerView) => void;
}) {
  const half = Math.ceil(categories.length / 2);
  const row1 = categories.slice(0, half);
  const row2 = categories.slice(half);

  // Duplicate for seamless loop
  const doubled1 = [...row1, ...row1];
  const doubled2 = [...row2, ...row2];

  return (
    <section className="xl-marquee xl-si" style={{ animationDelay: '0.25s' }}>
      <div className="xl-marquee__header">
        <h2>{categories.length} categories of operational UI</h2>
        <button type="button" className="xl-link-btn" onClick={() => onViewChange('docs')}>
          View all
        </button>
      </div>
      <div className="xl-marquee__row">
        <div className="xl-marquee__track">
          {doubled1.map((cat, i) => (
            <span key={`r1-${i}`} className="xl-marquee__chip">
              {cat.category} ({cat.count})
            </span>
          ))}
        </div>
      </div>
      <div className="xl-marquee__row">
        <div className="xl-marquee__track xl-marquee__track--reverse">
          {doubled2.map((cat, i) => (
            <span key={`r2-${i}`} className="xl-marquee__chip">
              {cat.category} ({cat.count})
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemeStrip({
  themeId,
  onThemeChange,
}: {
  themeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="xl-themes xl-si" style={{ animationDelay: '0.3s' }}>
      <div className="xl-themes__header">
        <h2>Themes</h2>
        <span className="xl-themes__preview-label">
          {hovered ?? 'Hover to preview'}
        </span>
      </div>
      <div className="xl-themes__grid">
        {XYTE_THEMES.map((theme) => {
          const c = theme.colors;
          return (
            <div
              key={theme.id}
              className={`xl-themes__swatch${theme.id === themeId ? ' xl-themes__swatch--active' : ''}`}
              title={theme.name}
              onMouseEnter={() => setHovered(theme.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onThemeChange(theme.id)}
            >
              <div style={{ background: c.bg }} />
              <div style={{ background: c.accent }} />
              <div style={{ background: c.success }} />
              <div style={{ background: c.surface }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LiveWidgetStrip({
  onViewChange,
}: {
  onViewChange: (view: ExplorerView) => void;
}) {
  return (
    <section className="xl-strip xl-si" style={{ animationDelay: '0.35s' }}>
      <div className="xl-strip__header">
        <h2>Live widgets</h2>
        <button type="button" className="xl-link-btn" onClick={() => onViewChange('explorer')}>
          Open in Explorer
        </button>
      </div>
      <div className="xl-strip__scroll">
        <div className="xl-strip__item">
          <Speedometer speed={95} />
          <span className="xl-strip__label">Automotive</span>
        </div>
        <div className="xl-strip__item">
          <SolarPanel output={4.8} daily={28.4} efficiency={21.3} />
          <span className="xl-strip__label">Energy</span>
        </div>
        <div className="xl-strip__item">
          <Chronograph />
          <span className="xl-strip__label">Watchmaking</span>
        </div>
        <div className="xl-strip__item">
          <AnomalyDetector confidence={94} />
          <span className="xl-strip__label">AI / Analytics</span>
        </div>
        <div className="xl-strip__item">
          <ReactorStatus temp={315} />
          <span className="xl-strip__label">Nuclear</span>
        </div>
      </div>
    </section>
  );
}

function ToolNavCards({
  onViewChange,
}: {
  onViewChange: (view: ExplorerView) => void;
}) {
  const tools = [
    {
      icon: <IconExplorer />,
      title: 'Explorer',
      desc: 'Interactive prop controls, live preview, and full registry access.',
      view: 'explorer' as ExplorerView,
    },
    {
      icon: <IconDocs />,
      title: 'Docs',
      desc: 'API reference, defaults, controls, and implementation guidance.',
      view: 'docs' as ExplorerView,
    },
    {
      icon: <IconGallery />,
      title: 'Gallery',
      desc: 'Visual grid of every widget rendered with default props.',
      view: 'gallery' as ExplorerView,
    },
    {
      icon: <IconDashboard />,
      title: 'Dashboard',
      desc: 'Curated operational dashboard with live data simulation.',
      view: 'dashboard' as ExplorerView,
    },
  ];

  return (
    <div className="xl-tools xl-si" style={{ animationDelay: '0.4s' }}>
      {tools.map((tool) => (
        <div
          key={tool.title}
          className="xl-tool-card"
          role="button"
          tabIndex={0}
          onClick={() => onViewChange(tool.view)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onViewChange(tool.view);
          }}
        >
          <div className="xl-tool-card__icon">{tool.icon}</div>
          <div className="xl-tool-card__title">{tool.title}</div>
          <div className="xl-tool-card__desc">{tool.desc}</div>
        </div>
      ))}
    </div>
  );
}

function QuickStart() {
  return (
    <section className="xl-quickstart xl-si" style={{ animationDelay: '0.45s' }}>
      <div className="xl-terminal">
        <div className="xl-terminal__bar">
          <span className="xl-terminal__dot xl-terminal__dot--red" />
          <span className="xl-terminal__dot xl-terminal__dot--yellow" />
          <span className="xl-terminal__dot xl-terminal__dot--green" />
        </div>
        <pre className="xl-terminal__code">
          <span className="xl-terminal__prompt">$ </span>git clone &lt;repo-url&gt;{'\n'}
          <span className="xl-terminal__prompt">$ </span>cd xyte-elements{'\n'}
          <span className="xl-terminal__prompt">$ </span>npm install{'\n'}
          <span className="xl-terminal__prompt">$ </span>npm run dev
        </pre>
      </div>
      <div className="xl-quickstart__steps">
        <h2>Get running in 30 seconds</h2>
        <div className="xl-quickstart__step">
          <span className="xl-quickstart__step-num">1</span>
          <span className="xl-quickstart__step-text">Clone the repository and install dependencies</span>
        </div>
        <div className="xl-quickstart__step">
          <span className="xl-quickstart__step-num">2</span>
          <span className="xl-quickstart__step-text">Run the dev server — widgets render instantly</span>
        </div>
        <div className="xl-quickstart__step">
          <span className="xl-quickstart__step-num">3</span>
          <span className="xl-quickstart__step-text">Open Explorer to browse props, themes, and controls</span>
        </div>
      </div>
    </section>
  );
}

function FooterCTA({
  docsIndex,
  onViewChange,
}: {
  docsIndex: ReturnType<typeof buildDocsIndex>;
  onViewChange: (view: ExplorerView) => void;
}) {
  return (
    <section className="xl-footer-cta xl-si" style={{ animationDelay: '0.5s' }}>
      <div
        className="xl-footer-cta__bg"
        style={{ backgroundImage: `url(${BASE_URL}assets/cta-glow.jpg)` }}
      />
      <div className="xl-footer-cta__content">
        <h2>Start building.</h2>
        <p className="xl-footer-cta__sub">
          {docsIndex.stats.widgetCount} widgets &middot; {docsIndex.stats.categoryCount} categories &middot;{' '}
          {docsIndex.stats.themeCount} themes &middot; {docsIndex.stats.modeCount} modes
        </p>
        <div className="xl-footer-cta__actions">
          <button type="button" className="xl-cta xl-cta--primary" onClick={() => onViewChange('explorer')}>
            Open Explorer
          </button>
          <button type="button" className="xl-cta" onClick={() => onViewChange('docs')}>
            Browse Docs
          </button>
        </div>
        <p className="xl-footer-cta__fine">Built for internal XYTE product teams</p>
      </div>
    </section>
  );
}

// --- Main component ---

export function LandingPage({
  themeId,
  mode,
  onThemeChange,
  onModeChange,
  onViewChange,
}: LandingPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const docsIndex = useMemo(() => buildDocsIndex(WIDGET_STORIES), []);

  return (
    <div className="xl-shell" data-theme={themeId} data-mode={mode}>
      <header className="xl-topbar">
        <div className="xl-brand">
          <XyteLogo s={14} />
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
        <HeroSection docsIndex={docsIndex} onViewChange={onViewChange} />
        <StatsRail docsIndex={docsIndex} />
        <CategoryMarquee categories={docsIndex.categoriesBySize} onViewChange={onViewChange} />
        <ThemeStrip themeId={themeId} onThemeChange={onThemeChange} />
        <LiveWidgetStrip onViewChange={onViewChange} />
        <ToolNavCards onViewChange={onViewChange} />
        <QuickStart />
        <FooterCTA docsIndex={docsIndex} onViewChange={onViewChange} />
      </main>
    </div>
  );
}
