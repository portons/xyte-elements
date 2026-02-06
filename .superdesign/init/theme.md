# Theme Tokens

## `src/theme/presets.ts`
```ts
import { MantineThemeOverride, Tuple } from '@mantine/core';

export interface XyteThemePreset {
  id: string;
  name: string;
  description: string;
  appBackground: string;
  accentGlow: string;
  cardBackground: string;
  cardBorder: string;
  softText: string;
  hardText: string;
}

const gray: Tuple<string, 10> = [
  '#FAFAFA',
  '#F5F5F5',
  '#EEEEEE',
  '#E0E0E0',
  '#BDBDBD',
  '#9E9E9E',
  '#757575',
  '#616161',
  '#424242',
  '#212121',
];

const blueGray: Tuple<string, 10> = [
  '#ECEFF1',
  '#CFD8DC',
  '#B0BEC5',
  '#90A4AE',
  '#78909C',
  '#607D8B',
  '#546E7A',
  '#455A64',
  '#37474F',
  '#263238',
];

const blueAccent: Tuple<string, 10> = [
  '#F1F9FE',
  '#82B1FF',
  '#448AFF',
  '#3681FF',
  '#2979FF',
  '#186FFF',
  '#0D68FF',
  '#2962FF',
  '#0040EF',
  '#002EAD',
];

const tealAccent: Tuple<string, 10> = [
  '#DEFFF8',
  '#A7FFEB',
  '#64FFDA',
  '#1DE9B6',
  '#00BFA5',
  '#00B098',
  '#009D88',
  '#007565',
  '#006254',
  '#004A40',
];

const redAccent: Tuple<string, 10> = [
  '#FFC4BF',
  '#FF8A80',
  '#FF5252',
  '#FF2929',
  '#FF1744',
  '#F90030',
  '#EC002E',
  '#D50000',
  '#C20000',
  '#900000',
];

export const XYTE_PRESETS: XyteThemePreset[] = [
  {
    id: 'xyte-classic',
    name: 'XYTE Classic',
    description: 'Closest to production language: cool neutrals + blue accent.',
    appBackground:
      'radial-gradient(1200px 500px at 90% -10%, rgba(41,121,255,0.2), transparent 70%), linear-gradient(180deg, #f4f8fb 0%, #edf3f8 100%)',
    accentGlow: 'rgba(41, 121, 255, 0.28)',
    cardBackground: 'rgba(255, 255, 255, 0.84)',
    cardBorder: 'rgba(176, 190, 197, 0.45)',
    softText: '#607D8B',
    hardText: '#263238',
  },
  {
    id: 'graphite-frost',
    name: 'Graphite Frost',
    description: 'Higher-contrast neutral variant for dense operation views.',
    appBackground:
      'radial-gradient(900px 500px at 10% -20%, rgba(0,191,165,0.22), transparent 75%), linear-gradient(180deg, #dfe9ef 0%, #e9f1f6 100%)',
    accentGlow: 'rgba(0, 191, 165, 0.28)',
    cardBackground: 'rgba(252, 253, 254, 0.8)',
    cardBorder: 'rgba(120, 144, 156, 0.35)',
    softText: '#455A64',
    hardText: '#1f2a30',
  },
  {
    id: 'midnight-haze',
    name: 'Midnight Haze',
    description: 'Darker operations floor variant with restrained blue highlights.',
    appBackground:
      'radial-gradient(1200px 600px at 90% -10%, rgba(68,138,255,0.24), transparent 70%), linear-gradient(180deg, #1f2932 0%, #1a232b 100%)',
    accentGlow: 'rgba(68, 138, 255, 0.3)',
    cardBackground: 'rgba(38, 50, 56, 0.68)',
    cardBorder: 'rgba(120, 144, 156, 0.35)',
    softText: '#CFD8DC',
    hardText: '#ECEFF1',
  },
];
```

## `src/styles.css`
```css
:root {
  color-scheme: light;
}

.app-shell {
  min-height: 100vh;
  position: relative;
  isolation: isolate;
  overflow: clip;
}

.app-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: radial-gradient(
      circle at 14% 10%,
      rgba(255, 255, 255, 0.8),
      transparent 42%
    ),
    radial-gradient(circle at 84% 22%, rgba(130, 177, 255, 0.35), transparent 45%);
  pointer-events: none;
}

.app-shell::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 35%
    ),
    linear-gradient(
      65deg,
      rgba(255, 255, 255, 0) 55%,
      rgba(255, 255, 255, 0.18) 100%
    );
  pointer-events: none;
}

.telemetry-dense {
  --widget-gap-scale: 1;
}

.telemetry-airy {
  --widget-gap-scale: 1.25;
}

.telemetry-airy .mantine-Stack-root {
  gap: calc(var(--widget-gap-scale) * 12px);
}

@media (max-width: 768px) {
  .app-shell {
    padding-bottom: 32px;
  }

  .telemetry-airy .mantine-Stack-root {
    gap: 12px;
  }
}
```
