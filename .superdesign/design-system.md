# XYTE Elements Design System

## Product context
This gallery mirrors XYTE operational UI language for AV/IoT fleets:
- Devices, incidents, rooms, spaces, and connectivity surfaces.
- Dashboard cards and controls inspired by existing `../server/web` Mantine patterns.

## Visual direction
- Typography: Inter only.
- Look: soft morphism cards with blur, subtle gradients, rounded corners, and low-contrast neutral backgrounds.
- Density: dashboard-first readability (muted labels + strong metric values).

## Token constraints
- Core neutral palettes from XYTE:
  - `gray` and `blue_gray` as primary structure colors.
  - `blue_accent` as primary interaction accent.
  - `teal_accent` for healthy/success states.
  - `red_accent` for critical/error states.
- Keep radius/elevation language close to XYTE:
  - Radius md-xl (0.75rem to 1.5rem)
  - Soft elevation shadows: `rgba(13,14,48,0.05)` + `rgba(38,50,56,0.09)`

## Themes
- `xyte-classic`: closest to existing production look.
- `graphite-frost`: denser, neutral ops mode.
- `midnight-haze`: dark operations variant.

## Component conventions
- Every card should use the `GlassCard` shell unless it has a strong reason not to.
- Keep action hierarchy simple: primary actions in blue accents, destructive actions in red accents.
- Prefer segmented controls and compact chips for dashboard filters.

## Motion
- Minimal only: hover elevation and subtle transparency shift.
- No heavy transitions; interactions should feel operational and immediate.

## Hard constraints for design iteration
- Use only tokens/colors in `src/theme/presets.ts`.
- Keep Inter as the only font family.
- Keep card morphology (blur + border + soft shadow) as base language.
