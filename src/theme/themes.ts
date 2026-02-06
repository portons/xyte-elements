import type { ThemeId, XyteWidgetMode } from '../explorer/types';

export interface XyteThemeTokens {
  id: ThemeId;
  name: string;
  neoStrength: 0.18;
  cardStyle: 'flat_ops';
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
  controlDepth: {
    keyShadow: string;
    ambientShadow: string;
    insetShadow: string;
  };
}

const withAlpha = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return hex;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const THEMES: Record<ThemeId, XyteThemeTokens> = {
  xyte_classic_dark: {
    id: 'xyte_classic_dark',
    name: 'XYTE Classic Dark',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#0B1020',
      surface: '#121931',
      surfaceAlt: '#171F3B',
      border: '#2B3559',
      text: '#E9EEF9',
      textMuted: '#98A6C9',
      accent: '#2979FF',
      success: '#00BFA5',
      warning: '#FFC107',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.34)',
      ambientShadow: '0 8px 18px rgba(7,11,25,0.34)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
    },
  },
  xyte_ops_light: {
    id: 'xyte_ops_light',
    name: 'XYTE Ops Light',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#F3F7FC',
      surface: '#FFFFFF',
      surfaceAlt: '#F8FBFF',
      border: '#D0D9E6',
      text: '#223044',
      textMuted: '#5F7088',
      accent: '#2979FF',
      success: '#009688',
      warning: '#FF8F00',
      danger: '#E53935',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(18,35,64,0.16)',
      ambientShadow: '0 8px 18px rgba(33,56,89,0.12)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(33,56,89,0.08)',
    },
  },
  xyte_midnight_haze: {
    id: 'xyte_midnight_haze',
    name: 'Midnight Haze',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#141A26',
      surface: '#1D2637',
      surfaceAlt: '#202C40',
      border: '#36465F',
      text: '#E6EDF7',
      textMuted: '#9BAAC0',
      accent: '#448AFF',
      success: '#1DE9B6',
      warning: '#FFCA28',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.34)',
      ambientShadow: '0 8px 18px rgba(10,15,24,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_graphite_neo: {
    id: 'xyte_graphite_neo',
    name: 'Graphite Neo',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#121417',
      surface: '#1B1F25',
      surfaceAlt: '#222731',
      border: '#343B49',
      text: '#E8EBF1',
      textMuted: '#A2ADBE',
      accent: '#82B1FF',
      success: '#64FFDA',
      warning: '#FFD54F',
      danger: '#FF8A80',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.32)',
      ambientShadow: '0 8px 18px rgba(5,8,13,0.3)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.32)',
    },
  },
  xyte_slate_cloud: {
    id: 'xyte_slate_cloud',
    name: 'Slate Cloud',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#EAF0F6',
      surface: '#F7FAFD',
      surfaceAlt: '#FFFFFF',
      border: '#C4D0DE',
      text: '#233040',
      textMuted: '#5D718A',
      accent: '#3681FF',
      success: '#00BFA5',
      warning: '#FFB300',
      danger: '#F44336',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(9,24,41,0.16)',
      ambientShadow: '0 8px 18px rgba(9,24,41,0.1)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(28,53,84,0.08)',
    },
  },
  xyte_teal_night: {
    id: 'xyte_teal_night',
    name: 'Teal Night',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#08151B',
      surface: '#10242D',
      surfaceAlt: '#14313C',
      border: '#245060',
      text: '#E3F3F7',
      textMuted: '#93B8C3',
      accent: '#00BFA5',
      success: '#64FFDA',
      warning: '#FFC107',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(2,12,16,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.36)',
    },
  },
};

export const XYTE_THEMES: XyteThemeTokens[] = Object.values(THEMES);
export const XYTE_THEME_IDS: ThemeId[] = Object.keys(THEMES) as ThemeId[];

export const getThemeTokens = (themeId: ThemeId): XyteThemeTokens =>
  THEMES[themeId] ?? THEMES.xyte_classic_dark;

export const buildRuntimeX = (themeId: ThemeId, mode: XyteWidgetMode) => {
  const theme = getThemeTokens(themeId);
  const isLegacy = mode === 'legacy';
  const text = theme.colors.text;
  const textMuted = theme.colors.textMuted;
  const accent = theme.colors.accent;

  return {
    bg: theme.colors.bg,
    bgAlt: theme.colors.surfaceAlt,
    surface: theme.colors.surface,
    surfaceAlt: theme.colors.surfaceAlt,
    border: theme.colors.border,
    borderLight: withAlpha(theme.colors.border, isLegacy ? 0.55 : 0.45),
    borderHov: withAlpha(accent, isLegacy ? 0.5 : 0.62),
    purple: accent,
    indigo: isLegacy ? '#536dfe' : '#448aff',
    teal: theme.colors.success,
    tealLight: isLegacy ? '#5de3cf' : '#64ffda',
    pink: isLegacy ? '#ff5f93' : '#ff4081',
    amber: theme.colors.warning,
    red: theme.colors.danger,
    text,
    textSec: withAlpha(textMuted, 0.92),
    textMut: textMuted,
    textBright: isLegacy ? '#ffffff' : withAlpha('#ffffff', 0.96),
    gradPrimary: `linear-gradient(135deg, ${theme.colors.accent}, ${isLegacy ? '#536dfe' : '#82b1ff'})`,
    gradHero: `linear-gradient(135deg, ${withAlpha(theme.colors.accent, 0.22)}, ${theme.colors.surface} 40%, ${theme.colors.surfaceAlt})`,
    gradCard: `linear-gradient(180deg, ${theme.colors.surfaceAlt} 0%, ${theme.colors.surface} 100%)`,
    r: 12,
    rs: 8,
    sh: `${theme.controlDepth.keyShadow}, ${theme.controlDepth.ambientShadow}`,
    shHov: `${theme.controlDepth.keyShadow}, 0 10px 24px ${withAlpha(theme.colors.bg, isLegacy ? 0.3 : 0.36)}`,
    f: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    m: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
  };
};
