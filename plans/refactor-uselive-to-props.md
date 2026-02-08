# Plan: Refactor useLive() to Props — Agent-per-File Approach

## Problem

461 `useLive()` calls across 43 widget files simulate live data. For production use, these must become props so real device data can be passed in. Previous script-based approach broke everything.

## Transformation Rules

For EVERY `useLive(BASE, VARIANCE, INTERVAL)` call:

### Rule 1: Simple literal base → Add as prop with default
```tsx
// BEFORE:
export function HVACZone({ title = 'HVAC Zone', setpoint = 22 }: { ... }) {
  const humidity = useLive(44, 4, 3500);

// AFTER:
export function HVACZone({ title = 'HVAC Zone', setpoint = 22, humidity = 44 }: { ... ; humidity?: number }) {
  // line deleted — humidity is now a prop
```

### Rule 2: Expression base → Add as prop, use expression as default
```tsx
// BEFORE:
export function HVACZone({ setpoint = 22 }: { setpoint?: number }) {
  const temp = useLive(setpoint + 0.6, 1.2, 2800);

// AFTER:
export function HVACZone({ setpoint = 22, temp = 22.6 }: { setpoint?: number; temp?: number }) {
  // line deleted — temp is now a prop with evaluated default
```

### Rule 3: useLive inside arrays/objects → Replace call with base value only
```tsx
// BEFORE:
const zones = [{ moisture: useLive(65, 8, 3000), nitrogen: useLive(42, 5, 4000) }];

// AFTER:
const zones = [{ moisture: 65, nitrogen: 42 }];
```

### Rule 4: useLive referencing other variables → Replace with base value
```tsx
// BEFORE:
const floorA = useLive(elevators[0].target, 3, 1800);

// AFTER (keep as local const, NOT a prop):
const floorA = elevators[0].target;
```

### Rule 5: Keep useAnim() wrapping if it exists
```tsx
// If the original was:
const a = useAnim(useLive(72, 5, 2000));
// Becomes a prop + useAnim:
// prop: value = 72
const a = useAnim(value);
```

### Rule 6: Remove useLive from imports, keep useAnim/useTick
```tsx
// BEFORE:
import { useAnim, useLive, useTick } from '../hooks';
// AFTER:
import { useAnim, useTick } from '../hooks';
```

### Rule 7: Add controls to registry.ts
For each NEW prop, add a control entry:
```ts
{ key: 'humidity', label: 'Humidity', kind: 'number' as const, min: 0, max: 100, step: 1 }
```

Also update defaultProps in the story definition with the new prop defaults.

## Execution Plan

### Step 0: Do ONE file first as proof — smart-building

I will refactor `src/widgets/smart-building/index.tsx` (16 useLive calls, diverse patterns) and show you the result before proceeding.

### Step 1: Batch the remaining 42 files into ~15 parallel agents

Each agent gets ONE file. Agent reads the file, applies the rules, edits the file, and verifies the component still exports correctly.

**Files by useLive count (43 total, excluding hooks.tsx):**

| # | File | Count |
|---|------|-------|
| 1 | space | 28 |
| 2 | water | 24 |
| 3 | offshore | 21 |
| 4 | aerospace | 20 |
| 5 | mining | 18 |
| 6 | robotics | 18 |
| 7 | stadium | 18 |
| 8 | energy | 18 |
| 9 | brewing | 17 |
| 10 | maritime | 17 |
| 11 | smart-building | 16 |
| 12 | semiconductor | 16 |
| 13 | telecom | 15 |
| 14 | broadcast | 15 |
| 15 | pharma | 15 |
| 16 | construction | 15 |
| 17 | manufacturing | 14 |
| 18 | agriculture | 11 |
| 19 | nuclear | 11 |
| 20 | logistics | 10 |
| 21 | printing | 10 |
| 22 | lab | 10 |
| 23 | weather | 9 |
| 24 | automotive | 9 |
| 25 | datacenter | 9 |
| 26 | retail | 8 |
| 27 | hifi | 8 |
| 28 | aviation | 7 |
| 29 | network | 6 |
| 30 | spatial | 6 |
| 31 | watchmaking | 6 |
| 32 | hospitality | 6 |
| 33 | room-climate | 4 |
| 34 | railway | 4 |
| 35 | signage | 4 |
| 36 | submarine | 4 |
| 37 | healthcare | 3 |
| 38 | education | 3 |
| 39 | steam | 3 |
| 40 | ai-analytics | 2 |
| 41 | collaboration | 1 |
| 42 | security | 1 |

### Step 2: Update registry.ts

After all widget files are done, update `src/widgets/registry.ts`:
- Add new controls for each new prop
- Update defaultProps for each story

### Step 3: Verify
- `npx tsc --noEmit` — zero errors
- `npx vite` — dev server starts, open in browser, visually verify

## Agent Prompt Template

Each agent receives:

```
Refactor useLive() to props in src/widgets/{PACK}/index.tsx.

RULES:
1. Read the file completely first
2. For each `useLive(BASE, VARIANCE, INTERVAL)`:
   a. If `const X = useLive(LITERAL, ...)` where LITERAL is a number → add X as a prop with default=LITERAL, delete the const line
   b. If `const X = useLive(EXPRESSION, ...)` where EXPRESSION references other variables/props → replace useLive(EXPRESSION, ...) with just EXPRESSION. Keep as const, do NOT make it a prop.
   c. If useLive() appears inline (inside array, object, Array.from, map) → replace useLive(BASE, ...) with just BASE
3. Remove `useLive` from the import line. If that leaves `import { } from '../hooks'` or `import {  } from '../hooks'`, remove the entire import line.
4. Do NOT touch useAnim() or useTick() — those stay
5. Do NOT change any JSX, styles, SVG, or layout
6. Do NOT change the function signature type annotation format — keep the inline style
7. Verify the file has zero remaining useLive references (except the import cleanup)

After editing, grep the file for 'useLive' to confirm zero remaining calls.
```
