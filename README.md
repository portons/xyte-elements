# XYTE Elements

Interactive gallery and component playground for XYTE UI elements.

## Goals
- Mirror existing XYTE style language (Mantine + Inter + neutral/blue accent palette).
- Centralize reusable dashboard widgets, controls, and operational components.
- Cover AV devices, telemetry, IoT control surfaces, rooms, spaces, location, and connectivity.
- Support multiple themes while keeping one baseline that resembles production XYTE.

## What is included
- Theme system with 3 presets:
  - `XYTE Classic`
  - `Graphite Frost`
  - `Midnight Haze`
- Widget gallery sections:
  - KPI dashboard cards
  - Incident aging chart
  - Telemetry chart widget
  - Interactive device controls
  - Room control center card
  - Space topology tree
  - Connectivity health list
  - Incident feed with priority filtering
  - Widget taxonomy map (aligned with current `device-widgets` IDs)
- Embedded research baseline from current app (`../server/web`).

## Research baseline used
Inspected source areas include:
- `../server/web/libs/core/src/lib/theme.ts`
- `../server/web/libs/core/src/lib/theme-colors.ts`
- `../server/web/apps/organizations/src/app/desktop/pages/overview/overview.constants.tsx`
- `../server/web/apps/organizations/src/app/desktop/pages/overview/overview-dashboard/widgets/*`
- `../server/web/libs/device-widgets/src/lib/widgets/*`
- `../server/web/apps/organizations/src/app/desktop/components/layouts/organizations-sidebar/v2/*`

Extracted foundations include:
- Data surfaces: claimed/online devices, incident feeds/rates/aging, room metrics, space counters, connector health.
- Functional groups: operations, inventories, connections, marketplace, and widget-based dashboard composition.
- Style language: rounded cards, soft shadowing, blue-gray neutrals, blue accent interactions, muted labels + strong metric values.

## Local development
```bash
npm install
npm run dev
```

Build and typecheck:
```bash
npm run typecheck
npm run build
```

## Notes
- Current build outputs a large JS chunk warning because the gallery intentionally includes charting and many widget demos in one page.
- Next step can split sections into lazy-loaded routes (`/dashboard`, `/controls`, `/rooms`, etc.) to reduce initial bundle size.
