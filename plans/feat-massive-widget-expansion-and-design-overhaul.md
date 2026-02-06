# ✨ feat: Massive Widget Expansion, Design Overhaul & Theme System

## Overview

Transform the XYTE Elements gallery from a 43-widget AV-focused dashboard into a comprehensive **80+ widget** design system with distinctive visual identity, modular architecture, and a rich multi-theme system. This plan covers three pillars: **(1)** dozens of new widgets across 6 new categories, **(2)** a bold design overhaul following the frontend-design skill's anti-slop aesthetic guidelines, and **(3)** an expanded theming engine with 12+ themes.

## Problem Statement / Motivation

The current gallery serves as a solid proof-of-concept but has limitations:

- **Widget variety** is narrow — all 43 widgets are AV/UC-focused. Modern IoT dashboards need AI analytics, security, energy, collaboration, signage, and spatial widgets.
- **Visual identity** uses generic Inter + JetBrains Mono pairing — competent but forgettable. The frontend-design skill demands *unforgettable* aesthetics.
- **Theming** has 6 themes that are all cool-toned blue/teal variations. No warm themes, no high-contrast accessibility themes, no industry-specific palettes.
- **Architecture** puts all 43 widgets in a single 1,600-line `library.tsx` with `@ts-nocheck` — unmaintainable for 80+ widgets.
- **Dashboard layout** is a linear vertical scroll with no way to filter or collapse sections.

## Proposed Solution

### Architecture: Modular Widget Files

Split `src/widgets/library.tsx` into per-category files:

```
src/widgets/
├── primitives.tsx          # Card, Badge, Btn, Prog, Slider, Lbl, M, Dot, etc.
├── hooks.tsx               # useAnim, useLive, useTick
├── fleet/
│   ├── KPI.tsx
│   ├── DeviceCard.tsx
│   ├── Gauge.tsx
│   ├── DeviceTable.tsx
│   └── UptimeTimeline.tsx
├── av-controls/
│   ├── PTZControl.tsx
│   ├── Mixer.tsx
│   ├── QuickControls.tsx
│   ├── InputSelector.tsx
│   ├── DisplayAdjust.tsx
│   ├── ColorTemp.tsx
│   ├── Toggle.tsx
│   └── CmdBtn.tsx
├── audio/
│   ├── AudioSpectrum.tsx
│   ├── AudioEQ.tsx
│   └── VolumeKnob.tsx
├── display-routing/
│   ├── VideoWall.tsx
│   ├── CrosspointMatrix.tsx
│   ├── SignalFlow.tsx
│   ├── ResolutionPicker.tsx
│   ├── AspectRatio.tsx
│   ├── EDIDManager.tsx
│   └── DisplayOrientation.tsx
├── room-climate/
│   ├── ScenePresets.tsx
│   ├── PowerSequencer.tsx
│   ├── MacroBuilder.tsx
│   ├── ThermostatControl.tsx
│   ├── Climate.tsx
│   ├── Occupancy.tsx
│   └── Schedule.tsx
├── network/
│   ├── NetworkInfo.tsx
│   ├── BandwidthMonitor.tsx
│   ├── AVoIPStats.tsx
│   ├── LatencyGraph.tsx
│   ├── PowerMonitor.tsx
│   ├── PoEManager.tsx
│   ├── PortStatus.tsx
│   ├── CertStatus.tsx
│   └── LampLife.tsx
├── incidents/
│   ├── AlertFeed.tsx
│   ├── CommandLog.tsx
│   ├── BulkActions.tsx
│   ├── CodeTester.tsx
│   └── FirmwareUpdate.tsx
├── ai-analytics/          # NEW CATEGORY
│   ├── ModelPerformance.tsx
│   ├── PredictionConfidence.tsx
│   ├── AnomalyDetector.tsx
│   ├── DataPipeline.tsx
│   ├── FeatureImportance.tsx
│   ├── TrainingProgress.tsx
│   └── InferenceLatency.tsx
├── security/              # NEW CATEGORY
│   ├── AccessLog.tsx
│   ├── ThreatMap.tsx
│   ├── IntrusionDetection.tsx
│   ├── FirewallRules.tsx
│   ├── VulnerabilityScanner.tsx
│   ├── SessionMonitor.tsx
│   └── ComplianceScore.tsx
├── collaboration/         # NEW CATEGORY
│   ├── ChatWidget.tsx
│   ├── VideoCallStatus.tsx
│   ├── AnnotationTool.tsx
│   ├── TeamActivity.tsx
│   ├── TaskBoard.tsx
│   └── NotificationCenter.tsx
├── energy/                # NEW CATEGORY
│   ├── SolarPanel.tsx
│   ├── BatteryStatus.tsx
│   ├── GridBalance.tsx
│   ├── EnergyFlow.tsx
│   ├── CarbonFootprint.tsx
│   └── PowerDistribution.tsx
├── signage/               # NEW CATEGORY
│   ├── ContentScheduler.tsx
│   ├── PlaylistManager.tsx
│   ├── ScreenBrightness.tsx
│   ├── MediaPreview.tsx
│   ├── CampaignTracker.tsx
│   └── AudienceMetrics.tsx
├── spatial/               # NEW CATEGORY
│   ├── FloorPlan.tsx
│   ├── AssetTracker.tsx
│   ├── Geofence.tsx
│   ├── HeatMap.tsx
│   ├── WayfindingMap.tsx
│   └── ZoneDensity.tsx
├── library.tsx            # Re-export barrel + DashboardContent
└── registry.ts            # Story definitions (updated)
```

### Phase 1: Architecture Refactor

**Goal:** Split monolithic file, remove `@ts-nocheck`, establish module pattern.

- [ ] Extract `src/widgets/hooks.tsx` — `useAnim`, `useLive`, `useTick`
- [ ] Extract `src/widgets/primitives.tsx` — `Card`, `Badge`, `Btn`, `Prog`, `Slider`, `Lbl`, `M`, `Dot`, `XyteLogo`, `Section`, `normalizeCardWidth`, `ease` constants
- [ ] Refactor theme runtime: make `X` a React context instead of module-level mutable `let X`
  - Create `ThemeContext` in `src/theme/ThemeContext.tsx`
  - `useTheme()` hook replaces all direct `X.property` reads
  - Provider wraps `App` component
- [ ] Split existing 43 widgets into per-category folders (7 folders, files listed above)
- [ ] Update `registry.ts` to import from new locations
- [ ] Update `library.tsx` to be a barrel re-export
- [ ] Remove `@ts-nocheck` and add proper TypeScript types to all widget props
- [ ] Verify all existing widgets render correctly after refactor

### Phase 2: Design Overhaul

**Goal:** Transform from "competent dashboard" to "unforgettable design system" per frontend-design skill.

**Typography Revolution:**
- [ ] Replace Inter with **Geist Sans** (body) — Vercel's distinctive sans-serif
- [ ] Replace JetBrains Mono with **Geist Mono** (mono) — pairs perfectly
- [ ] Add a display/hero font: **Cabinet Grotesk** for section headers
- [ ] Update `index.html` font links and `base.css` body font-family
- [ ] Update all font references in `themes.ts` `buildRuntimeX` (`f` and `m` properties)

**Color & Visual Identity:**
- [ ] Add CSS noise/grain texture overlay for depth (subtle `background-image: url(data:...)` SVG noise)
- [ ] Implement glassmorphism card variant with `backdrop-filter: blur()` for key widgets
- [ ] Add animated gradient mesh backgrounds for dashboard sections
- [ ] Implement card glow effects that respond to accent color per theme
- [ ] Add subtle parallax scroll effect on dashboard hero section

**Motion & Micro-interactions:**
- [ ] Staggered entrance animations with `animation-delay` on dashboard sections (already partially done, improve timing)
- [ ] Hover state upgrades: cards lift + border glow + subtle scale
- [ ] Add spring-based easing to interactive controls (sliders, knobs, toggles)
- [ ] Scroll-triggered reveal animations for sections entering viewport (IntersectionObserver-based)
- [ ] Pulsing live data indicators with coordinated animation timing
- [ ] Add smooth page transitions between dashboard and explorer views

**Spatial Composition:**
- [ ] Redesign dashboard layout with CSS Grid areas — break the monotonous vertical flow
- [ ] Hero section with asymmetric layout: KPIs on left, live status visualization on right
- [ ] Implement a "magazine-style" mixed-width grid for widget sections
- [ ] Add decorative dividers between sections (gradient lines, not plain borders)

### Phase 3: New Widget Categories (40+ new widgets)

Each widget follows the existing pattern: function component, `Card` wrapper, `X` theme tokens, exported and registered in `registry.ts`.

#### 🧠 AI & Analytics (7 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `ModelPerformance` | Accuracy/loss metrics with epoch chart | Dual-axis sparkline |
| `PredictionConfidence` | Confidence distribution histogram | Animated bar chart with threshold line |
| `AnomalyDetector` | Real-time anomaly scoring with timeline | Red-pulsing dots on timeline |
| `DataPipeline` | ETL pipeline stages with throughput | Animated flow diagram |
| `FeatureImportance` | Horizontal bar chart of feature weights | Sorted bars with gradient fill |
| `TrainingProgress` | Model training epochs with ETA | Circular progress + metrics |
| `InferenceLatency` | P50/P95/P99 latency percentiles | Box-whisker-style bars |

#### 🔒 Security (7 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `AccessLog` | Recent auth events with user/IP/time | Scrolling feed with severity dots |
| `ThreatMap` | Geographic threat origin visualization | SVG world map with animated pings |
| `IntrusionDetection` | IDS/IPS event timeline | Timeline with severity-colored blocks |
| `FirewallRules` | Active rules with hit counts | Sortable table with rule actions |
| `VulnerabilityScanner` | CVE scan results with severity | Donut chart + severity list |
| `SessionMonitor` | Active sessions with geo + device | Live session cards with pulse |
| `ComplianceScore` | Compliance framework score (SOC2, etc.) | Large score gauge + checklist |

#### 💬 Collaboration (6 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `ChatWidget` | Mini chat interface with messages | Message bubbles with typing indicator |
| `VideoCallStatus` | Active call participants + quality | Avatar grid with connection quality dots |
| `AnnotationTool` | Drawing overlay for screenshots | Canvas with tool palette |
| `TeamActivity` | Recent team actions feed | Activity stream with avatars |
| `TaskBoard` | Kanban-style task columns | Draggable-looking cards in columns |
| `NotificationCenter` | Grouped notifications with actions | Categorized notification list |

#### ⚡ Energy Management (6 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `SolarPanel` | Solar generation + efficiency | Animated sun icon + production graph |
| `BatteryStatus` | Battery level with charge/discharge | Animated fill battery icon |
| `GridBalance` | Grid import/export balance | Bidirectional flow animation |
| `EnergyFlow` | Sankey-style energy flow diagram | Animated flowing paths |
| `CarbonFootprint` | CO₂ emissions tracker | Leaf icon + comparison bars |
| `PowerDistribution` | Power allocation across circuits | Treemap-style blocks |

#### 📺 Digital Signage (6 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `ContentScheduler` | Daily content timeline | Calendar timeline with content blocks |
| `PlaylistManager` | Ordered content playlist | Drag-handle list items |
| `ScreenBrightness` | Ambient-aware brightness control | Arc slider with sun icon |
| `MediaPreview` | Content thumbnail preview grid | Image grid with play overlays |
| `CampaignTracker` | Campaign performance metrics | Mini funnel chart |
| `AudienceMetrics` | Viewer analytics dashboard | Counter with dwell-time graph |

#### 🗺️ Maps & Spatial (6 widgets)

| Widget | Description | Key Visual Element |
|--------|-------------|-------------------|
| `FloorPlan` | SVG floor plan with device pins | Interactive SVG with clickable zones |
| `AssetTracker` | Asset location with movement trails | Animated dots with trail paths |
| `Geofence` | Zone boundaries with alerts | Bordered regions with entry/exit indicators |
| `HeatMap` | Density heatmap overlay | Gradient color cells |
| `WayfindingMap` | Navigation path visualization | Animated dotted path |
| `ZoneDensity` | Zone occupancy percentage | Color-coded zone cards |

### Phase 4: Theme Expansion

**Goal:** 12+ themes covering warm/cool, light/dark, high-contrast, and industry-specific palettes.

#### New Themes to Add

| Theme ID | Name | Tone | Description |
|----------|------|------|-------------|
| `xyte_ember_warm` | Ember Warm | Dark, warm | Amber/copper accent on charcoal bg |
| `xyte_arctic_frost` | Arctic Frost | Light, cool | Ice blue accent on snow white |
| `xyte_forest_deep` | Forest Deep | Dark, natural | Emerald green on deep brown-black |
| `xyte_sunset_blaze` | Sunset Blaze | Dark, warm | Orange-red gradient accents |
| `xyte_ocean_depth` | Ocean Depth | Dark, cool | Deep navy with aquamarine accents |
| `xyte_high_contrast` | High Contrast | A11y | Pure black/white with bold accent |
| `xyte_solarized_light` | Solarized Light | Light | Based on Solarized color scheme |
| `xyte_nord_frost` | Nord Frost | Dark, cool | Based on Nord palette |
| `xyte_dracula_pro` | Dracula Pro | Dark | Based on Dracula color scheme |
| `xyte_healthcare` | Healthcare | Light | Calming blue-green for medical |
| `xyte_industrial` | Industrial | Dark | Amber warnings on dark steel |
| `xyte_retail` | Retail | Light, warm | Warm coral/magenta for retail ops |

**Implementation for each theme:**
- [ ] Add to `ThemeId` union type in `src/explorer/types.ts`
- [ ] Add token definition in `src/theme/themes.ts`
- [ ] Add CSS variables in `src/styles/themes.css`
- [ ] Test all widgets render correctly under each new theme

**Theme Infrastructure Improvements:**
- [ ] Add theme preview swatches in the theme selector (show accent + bg + surface colors)
- [ ] Add theme category grouping in selector (Dark / Light / A11y / Industry)
- [ ] Add a "theme customizer" panel in explorer that lets users tweak accent color
- [ ] Store theme preference in localStorage

### Phase 5: Explorer & Dashboard UX Improvements

**Explorer Improvements:**
- [ ] Add widget count badges per category in sidebar
- [ ] Add "Favorites" system — star widgets, filter to favorites
- [ ] Add keyboard navigation (↑/↓ to browse widgets, Enter to select)
- [ ] Add code snippet preview panel showing widget usage code
- [ ] Add "Compare" mode — view two widgets side by side
- [ ] Improve search with fuzzy matching

**Dashboard Improvements:**
- [ ] Add collapsible sections with smooth animation
- [ ] Add "Compact / Comfortable / Spacious" density toggle
- [ ] Add widget grid area drag-to-resize concept
- [ ] Add section quick-nav sidebar (scrollspy that highlights current section)
- [ ] Add a "Featured Widgets" hero section at the top with 3 rotating highlights

## Technical Considerations

### Performance
- **Lazy-load widget modules**: Use `React.lazy` + `Suspense` per category folder to avoid loading all 80+ widgets upfront
- **Virtualize dashboard**: For the full dashboard view, only render widgets in/near viewport using IntersectionObserver
- **Throttle live data hooks**: `useLive` and `useTick` should batch updates and use `requestAnimationFrame` for animation hooks
- **Memoize SVG renders**: Many widgets have static SVG portions that should be wrapped in `useMemo`

### Accessibility
- All new themes must pass WCAG 2.1 AA contrast ratios (4.5:1 for text, 3:1 for large text)
- The `xyte_high_contrast` theme targets AAA (7:1) compliance
- All interactive widgets need `role`, `aria-label`, `aria-describedby` attributes
- Keyboard navigation for all interactive controls (sliders, knobs, toggles, buttons)
- `prefers-reduced-motion` media query already in `base.css` — ensure new animations respect it

### Architecture Decisions
- Keep zero external UI dependencies (no Mantine, no MUI) — this is a custom design system
- Keep inline styles via `X` theme object (don't switch to CSS modules — the existing pattern is consistent)
- Use React Context for theme runtime instead of module-level mutable state
- Keep all widgets self-contained (no inter-widget dependencies beyond primitives)

## Acceptance Criteria

### Functional Requirements
- [ ] 80+ working widgets across 13 categories
- [ ] All widgets render correctly in all 18 themes
- [ ] All widgets work in both legacy and modern modes
- [ ] All widgets are responsive (desktop and mobile viewports)
- [ ] Explorer search, filtering, and category browsing work with all widgets
- [ ] Dashboard page renders all widgets grouped by section

### Non-Functional Requirements
- [ ] Page load under 2s (with lazy loading)
- [ ] No `@ts-nocheck` — full TypeScript coverage
- [ ] WCAG 2.1 AA compliance for all themes
- [ ] Smooth 60fps animations on all interactive widgets
- [ ] Bundle size under 500KB gzipped

### Quality Gates
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] Playwright audit sweep passes for all widget × theme × mode × viewport combinations
- [ ] Visual regression: no unintended changes to existing 43 widgets

## Implementation Build Sequence

1. **Phase 1** — Architecture Refactor (extract context, split files)
2. **Phase 2** — Design Overhaul (fonts, colors, animations, layout)
3. **Phase 3** — New Widgets (7 batches of ~6 widgets each, by category)
4. **Phase 4** — Theme Expansion (12 new themes, theme infrastructure)
5. **Phase 5** — Explorer & Dashboard UX

Each phase can be independently verified before proceeding. Phases 3 and 4 can be parallelized.

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Monolithic file split breaks existing widgets | Medium | High | Verify each widget after extraction with Playwright sweep |
| New themes cause contrast issues | Medium | Medium | Automated contrast ratio checking in CI |
| 80+ widgets cause performance regression | Low | High | Lazy loading per category, virtualized dashboard |
| Design overhaul changes look generic | Low | Medium | Follow frontend-design skill strictly — bold, intentional choices |
| TypeScript migration reveals hidden bugs | Medium | Low | Fix incrementally, keep running builds |

## References

### Internal References
- Widget library: `src/widgets/library.tsx` (all 43 widgets)
- Widget registry: `src/widgets/registry.ts` (story definitions)
- Theme system: `src/theme/themes.ts` (6 themes + runtime builder)
- Explorer page: `src/pages/ExplorerPage.tsx` (widget browser)
- Dashboard page: `src/pages/DashboardPage.tsx` (full dashboard)
- Types: `src/explorer/types.ts` (ThemeId, WidgetMode, etc.)
- Base styles: `src/styles/base.css` (animations, resets)
- Theme CSS: `src/styles/themes.css` (CSS variable per theme)
- Component styles: `src/styles/components.css` (explorer layout)

### External References
- Geist Font: https://vercel.com/font
- Cabinet Grotesk: https://www.fontshare.com/fonts/cabinet-grotesk
- Nord Color Palette: https://www.nordtheme.com
- Dracula Theme: https://draculatheme.com
- Solarized: https://ethanschoonover.com/solarized
