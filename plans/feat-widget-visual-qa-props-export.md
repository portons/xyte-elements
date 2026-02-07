# feat: Widget Visual QA, Props System & Export

## Overview

Systematically fix sizing/spacing across all 194 widgets, add configurable props to every widget, and add export functionality to the Explorer.

**Current state:**
- 29 packs, 194 widgets
- Only 35 widgets accept typed props (mostly `core-widgets`, a few AV controls)
- Only ~3 stories have registry controls (out of 194)
- ~159 widgets are zero-prop, using hardcoded mock data
- Explorer already has: canvas + zoom, props panel (empty for most widgets), code view with copy-to-clipboard
- No visual regression tooling, no JSON/embed export

---

## Problem Statement

1. **Sizing/spacing**: Widgets are too small at 1x zoom (default had to be bumped to 1.5x). Text is cramped, labels and values lack breathing room. This needs a systematic visual pass.
2. **No real props**: The vast majority of widgets are hardcoded demo components. Users can't configure them in the Explorer props panel because no `controls` are defined in `registry.ts` and no props are accepted by the component.
3. **Export is basic**: Only a "copy JSX snippet" exists. No JSON config export, no embed code, no download-as-image.

---

## Proposed Solution — 4 Phases

### Phase 1: Visual QA Gallery Mode

**Goal:** Build a "gallery view" in the Explorer that renders ALL widgets in a scrollable grid, so you can eyeball every one at once and spot sizing/spacing issues.

**Files to create/modify:**
- `src/pages/GalleryPage.tsx` (new) — renders every widget from `WIDGET_STORIES` in a masonry/flex grid
- `src/App.tsx` — add route/view for gallery
- `src/styles/components.css` — gallery layout styles

**How it works:**
- One page, all 194 widgets rendered simultaneously (virtualized if needed)
- Category headers between groups
- Click any widget to jump to its Explorer detail
- A "flag" button on each widget to mark it as "needs fix" (just localStorage state)
- Toggle between 1x / 1.5x / 2x scale for the whole gallery

**Why:** Manually clicking through 194 widgets in the Explorer is painfully slow. A gallery view lets you scan 20-30 at once and spot the broken ones.

### Phase 2: Spacing & Sizing Fixes

**Goal:** Fix the actual CSS/inline-style issues. Two sub-tasks:

#### 2A: Global primitive fixes (`src/widgets/primitives.tsx`)

Review and bump:
- [ ] `Card` inner padding: ensure minimum 20px (done — was 16, bumped to 20)
- [x] `Lbl` font-size: ensure 10px minimum, add `marginBottom: 3` default
- [x] `Badge` padding: bump to `3px 8px` minimum
- [x] `M` line-height: ensure at least 1.3 for readability
- [x] `Section` gap between widgets: bump from 10 to 12-14px
- [x] Add a `CardTitle` primitive for the common `fontSize: 13, fontWeight: 700` header pattern — standardize to 14px

#### 2B: Per-widget fixes (batch processing)

For each of the 29 packs, audit and fix:
- [ ] Minimum card width 350px (some older packs still have 260-300px)
- [ ] Ensure grid column widths leave room for text (e.g. `gridTemplateColumns` values)
- [ ] Increase inner font sizes: data values >=10px, labels >=9px, secondary text >=8px
- [ ] Add gap/margin between label-value pairs (minimum 3-4px)
- [ ] Table row height: minimum 28px for readability
- [ ] Truncation with `textOverflow: 'ellipsis'` where text might overflow

**Approach:** Process 3-4 packs at a time via agents. Use the Gallery view to verify fixes visually.

### Phase 3: Props System for All Widgets

**Goal:** Every widget accepts meaningful configurable props and has corresponding `controls` in the registry.

#### 3A: Define a prop taxonomy

Every widget should expose at minimum:
- **Data props**: The primary values it displays (numbers, strings, arrays)
- **Configuration props**: Thresholds, labels, units, modes
- **Style props**: Optional color overrides, size variants

Common prop patterns to extract:

| Pattern | Props | Control type |
|---------|-------|-------------|
| Big metric | `value: number`, `label: string`, `unit: string` | number slider, text |
| Status table | `data: Array<{...}>` | (no simple control — use preset selector) |
| Gauge/bar | `value: number`, `min: number`, `max: number`, `color: string` | number slider |
| Status indicator | `status: string`, `label: string` | select |
| Time series | `data: number[]` | (preset selector) |

#### 3B: Refactor widgets to accept props

For each widget:
1. Identify which hardcoded `useMemo` data arrays should become props with defaults
2. Extract the top 3-5 most useful values as typed props with defaults
3. Keep `useMemo`/`useLive` hooks for animation — props set the *base* values

**Example refactor (before → after):**

```tsx
// BEFORE: FleetGPS — zero props, hardcoded data
export function FleetGPS() {
  const vehicles = useMemo(() => [
    { id: 'TRK-4801', loc: 'I-95 N', spd: 62, status: 'moving' },
    // ...
  ], []);
  return <Card noPad style={{ width: 470 }}>...</Card>;
}

// AFTER: FleetGPS — configurable
export function FleetGPS({
  vehicles = DEFAULT_VEHICLES,
  title = 'Fleet GPS',
}: {
  vehicles?: Array<{ id: string; loc: string; spd: number; hdg: string; status: string }>;
  title?: string;
}) {
  // ...
}
```

#### 3C: Registry controls for each widget

Add `controls` array to every `story()` call in `registry.ts`:

```ts
story('fleet-gps', 'Fleet GPS', 'Logistics', FleetGPS, {}, [
  { key: 'title', label: 'Title', kind: 'select', options: [
    { label: 'Fleet GPS', value: 'Fleet GPS' },
    { label: 'Vehicle Tracking', value: 'Vehicle Tracking' },
  ]},
]),
```

For table/array-data widgets, use a "preset" pattern:
```ts
{ key: 'preset', label: 'Data Set', kind: 'select', options: [
  { label: 'Default (6 vehicles)', value: 'default' },
  { label: 'Minimal (2 vehicles)', value: 'minimal' },
  { label: 'Large fleet (12 vehicles)', value: 'large' },
]}
```

**Scale:** ~194 widgets. Process in batches of ~20-25 (one pack at a time). Each pack takes ~5 min for an agent.

### Phase 4: Export System

**Goal:** Let users export widget configurations from the Explorer.

#### 4A: JSON Config Export

Add a "Export JSON" button to the Explorer toolbar that outputs:
```json
{
  "widget": "fleet-gps",
  "props": { "title": "Vehicle Tracking" },
  "theme": "xyte_classic_dark",
  "mode": "modern"
}
```

**File:** Add to `ExplorerPage.tsx` toolbar

#### 4B: Embed Code Export

Generate a self-contained `<iframe>` embed snippet or a React import snippet:
```html
<!-- Embed -->
<iframe src="https://elements.xyte.io/embed/fleet-gps?theme=xyte_classic_dark"
  width="470" height="300" frameborder="0" />
```

```tsx
// React
import { FleetGPS } from '@xyte/elements';
<FleetGPS title="Vehicle Tracking" />
```

**File:** New `src/components/ExportPanel.tsx`

#### 4C: Download as PNG

Use `html2canvas` or `dom-to-image` to screenshot the canvas stage and trigger download.

**File:** Add utility to `ExplorerPage.tsx`, install dependency

---

## Acceptance Criteria

### Phase 1 — Gallery
- [x] New Gallery view accessible from the Explorer nav
- [x] All 194 widgets rendered in a categorized grid
- [x] Click-to-navigate to Explorer detail view
- [x] Zoom control for the whole gallery

### Phase 2 — Sizing
- [x] No widget has card width below 350px
- [x] All text is readable at 1x zoom (no need for 1.5x default)
- [x] Minimum spacing between labels and values is 3px
- [x] Default Explorer zoom reset to 1.0 (currently 1.5)

### Phase 3 — Props
- [x] Every widget accepts at least 2 configurable props
- [x] Every story in the registry has at least 1 control
- [x] Props panel works for all 194 widgets
- [x] "Reset to defaults" works correctly for all widgets

### Phase 4 — Export
- [x] JSON config export with copy-to-clipboard
- [x] React code snippet export (already exists, enhance with full props)
- [x] PNG download of current widget
- [x] Embed iframe code generation

---

## Implementation Order & Dependencies

```
Phase 1 (Gallery) ──→ Phase 2 (Sizing) ──→ Phase 3 (Props) ──→ Phase 4 (Export)
       │                      │
       └── needed to QA ──────┘
```

Phase 1 must come first — it's the tool we need to efficiently do Phase 2.
Phase 3 is independent of Phase 2 but benefits from fixed sizing.
Phase 4 depends on Phase 3 (needs props system to export config).

---

## Effort Estimate

| Phase | Widget packs | Approach |
|-------|-------------|----------|
| Phase 1 | 0 (tooling) | Single new page + styles |
| Phase 2 | 29 packs | Agents: 3-4 packs per batch, ~8 batches |
| Phase 3 | 29 packs | Agents: 1 pack per agent, ~10 batches of 3 |
| Phase 4 | 0 (tooling) | ExportPanel component + html2canvas |

---

## Risk Analysis

1. **Performance**: Rendering 194 widgets simultaneously in Gallery may be slow → mitigate with virtualization or lazy rendering (IntersectionObserver)
2. **Props breaking widgets**: Refactoring from hardcoded to prop-driven could break animation hooks → keep `useLive`/`useAnim` internal, only expose base values as props
3. **Registry explosion**: Adding controls to 194 stories makes `registry.ts` very large → consider splitting into per-category registry files

---

## Files Involved

### New files
- `src/pages/GalleryPage.tsx`
- `src/components/ExportPanel.tsx`

### Modified files
- `src/App.tsx` — add gallery route
- `src/widgets/primitives.tsx` — spacing/sizing fixes
- `src/widgets/*/index.tsx` (all 29 packs) — props refactor + sizing
- `src/widgets/registry.ts` — controls for all stories
- `src/pages/ExplorerPage.tsx` — export buttons, link to gallery
- `src/styles/components.css` — gallery styles, spacing fixes
