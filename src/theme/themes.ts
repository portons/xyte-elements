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
  xyte_ember_warm: {
    id: 'xyte_ember_warm',
    name: 'Ember Warm',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#1A1210',
      surface: '#241C18',
      surfaceAlt: '#2E241E',
      border: '#4A3828',
      text: '#F5E8DB',
      textMuted: '#BFA48A',
      accent: '#E8833A',
      success: '#66BB6A',
      warning: '#FFB74D',
      danger: '#EF5350',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(10,6,4,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_arctic_frost: {
    id: 'xyte_arctic_frost',
    name: 'Arctic Frost',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#F0F5FA',
      surface: '#FFFFFF',
      surfaceAlt: '#F7FBFF',
      border: '#C8D8EA',
      text: '#1A2B3C',
      textMuted: '#5A7088',
      accent: '#4FC3F7',
      success: '#26A69A',
      warning: '#FFA726',
      danger: '#EF5350',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(12,30,52,0.12)',
      ambientShadow: '0 8px 18px rgba(12,30,52,0.08)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(12,30,52,0.06)',
    },
  },
  xyte_forest_deep: {
    id: 'xyte_forest_deep',
    name: 'Forest Deep',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#0D1510',
      surface: '#142018',
      surfaceAlt: '#1A2A1F',
      border: '#2D4A35',
      text: '#E0F0E4',
      textMuted: '#8CB896',
      accent: '#4CAF50',
      success: '#66BB6A',
      warning: '#FFC107',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(4,8,5,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_sunset_blaze: {
    id: 'xyte_sunset_blaze',
    name: 'Sunset Blaze',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#1A1015',
      surface: '#241820',
      surfaceAlt: '#2E1E28',
      border: '#4A2838',
      text: '#F5E0E8',
      textMuted: '#BF8A9A',
      accent: '#FF6D00',
      success: '#66BB6A',
      warning: '#FFD54F',
      danger: '#FF1744',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(10,4,8,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_ocean_depth: {
    id: 'xyte_ocean_depth',
    name: 'Ocean Depth',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#0A1628',
      surface: '#0F1E35',
      surfaceAlt: '#142842',
      border: '#1E3A5F',
      text: '#E0EEF8',
      textMuted: '#7AA3C4',
      accent: '#00E5FF',
      success: '#1DE9B6',
      warning: '#FFD740',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(4,8,16,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_high_contrast: {
    id: 'xyte_high_contrast',
    name: 'High Contrast',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#000000',
      surface: '#0A0A0A',
      surfaceAlt: '#141414',
      border: '#3A3A3A',
      text: '#FFFFFF',
      textMuted: '#C0C0C0',
      accent: '#FFFF00',
      success: '#00FF00',
      warning: '#FFA500',
      danger: '#FF0000',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.5)',
      ambientShadow: '0 8px 18px rgba(0,0,0,0.5)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    },
  },
  xyte_solarized_light: {
    id: 'xyte_solarized_light',
    name: 'Solarized Light',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#FDF6E3',
      surface: '#EEE8D5',
      surfaceAlt: '#F5EFDC',
      border: '#D3CBB8',
      text: '#073642',
      textMuted: '#586E75',
      accent: '#268BD2',
      success: '#859900',
      warning: '#B58900',
      danger: '#DC322F',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,43,54,0.12)',
      ambientShadow: '0 8px 18px rgba(0,43,54,0.08)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,43,54,0.06)',
    },
  },
  xyte_nord_frost: {
    id: 'xyte_nord_frost',
    name: 'Nord Frost',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#2E3440',
      surface: '#3B4252',
      surfaceAlt: '#434C5E',
      border: '#4C566A',
      text: '#ECEFF4',
      textMuted: '#D8DEE9',
      accent: '#88C0D0',
      success: '#A3BE8C',
      warning: '#EBCB8B',
      danger: '#BF616A',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.32)',
      ambientShadow: '0 8px 18px rgba(20,24,30,0.3)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.32)',
    },
  },
  xyte_dracula_pro: {
    id: 'xyte_dracula_pro',
    name: 'Dracula Pro',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#282A36',
      surface: '#343746',
      surfaceAlt: '#3E4154',
      border: '#44475A',
      text: '#F8F8F2',
      textMuted: '#6272A4',
      accent: '#BD93F9',
      success: '#50FA7B',
      warning: '#F1FA8C',
      danger: '#FF5555',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.32)',
      ambientShadow: '0 8px 18px rgba(15,16,22,0.3)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.32)',
    },
  },
  xyte_healthcare: {
    id: 'xyte_healthcare',
    name: 'Healthcare',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#F0F7F5',
      surface: '#FFFFFF',
      surfaceAlt: '#F5FBF9',
      border: '#C8E0D8',
      text: '#1A3C32',
      textMuted: '#5A8A78',
      accent: '#009688',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(10,40,30,0.12)',
      ambientShadow: '0 8px 18px rgba(10,40,30,0.08)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(10,40,30,0.06)',
    },
  },
  xyte_industrial: {
    id: 'xyte_industrial',
    name: 'Industrial',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#121416',
      surface: '#1A1D22',
      surfaceAlt: '#22262D',
      border: '#3A3F4A',
      text: '#E8EAED',
      textMuted: '#9AA0AB',
      accent: '#FFB300',
      success: '#66BB6A',
      warning: '#FF9800',
      danger: '#FF5252',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(0,0,0,0.36)',
      ambientShadow: '0 8px 18px rgba(6,8,10,0.36)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.34)',
    },
  },
  xyte_retail: {
    id: 'xyte_retail',
    name: 'Retail',
    neoStrength: 0.18,
    cardStyle: 'flat_ops',
    colors: {
      bg: '#FFF5F5',
      surface: '#FFFFFF',
      surfaceAlt: '#FFF8F6',
      border: '#EACCC4',
      text: '#3C1A1A',
      textMuted: '#8A5A5A',
      accent: '#E91E63',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
    },
    controlDepth: {
      keyShadow: '0 1px 1px rgba(40,10,10,0.12)',
      ambientShadow: '0 8px 18px rgba(40,10,10,0.08)',
      insetShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(40,10,10,0.06)',
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
    f: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    m: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
  };
};
