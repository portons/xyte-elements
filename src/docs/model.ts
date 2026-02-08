import type {
  WidgetControlSpec,
  WidgetStoryDefinition,
  XyteWidgetMode,
} from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';

export interface DocsWidgetControl {
  key: string;
  label: string;
  kind: WidgetControlSpec['kind'];
  rangeLabel: string;
  optionsLabel: string;
}

export interface DocsWidgetEntry {
  id: string;
  title: string;
  category: string;
  defaultMode: XyteWidgetMode;
  defaultProps: Record<string, unknown>;
  defaultPropsJson: string;
  controls: DocsWidgetControl[];
  searchableText: string;
}

export interface DocsCategoryCount {
  category: string;
  count: number;
}

export interface DocsStats {
  widgetCount: number;
  categoryCount: number;
  themeCount: number;
  modeCount: number;
  controlCount: number;
}

export interface DocsIndex {
  widgets: DocsWidgetEntry[];
  categories: string[];
  categoriesBySize: DocsCategoryCount[];
  themeNames: string[];
  modes: XyteWidgetMode[];
  stats: DocsStats;
}

const formatRange = (control: WidgetControlSpec): string => {
  if (control.kind !== 'number') return 'n/a';
  const min = control.min ?? 0;
  const max = control.max ?? 100;
  const step = control.step ?? 1;
  return `${min} to ${max} (step ${step})`;
};

const formatOptions = (control: WidgetControlSpec): string => {
  if (!control.options || control.options.length === 0) return 'n/a';
  return control.options.map((option) => `${option.label} (${option.value})`).join(', ');
};

const normalizeControl = (control: WidgetControlSpec): DocsWidgetControl => ({
  key: control.key,
  label: control.label,
  kind: control.kind,
  rangeLabel: formatRange(control),
  optionsLabel: formatOptions(control),
});

export const buildDocsIndex = (
  stories: WidgetStoryDefinition[],
): DocsIndex => {
  const widgets = stories.map((story) => {
    const controls = story.controls.map(normalizeControl);
    const controlTerms = controls
      .map((control) => `${control.key} ${control.label} ${control.optionsLabel}`)
      .join(' ');

    return {
      id: story.id,
      title: story.title,
      category: story.category,
      defaultMode: story.defaultMode,
      defaultProps: story.defaultProps,
      defaultPropsJson: JSON.stringify(story.defaultProps, null, 2),
      controls,
      searchableText: `${story.id} ${story.title} ${story.category} ${controlTerms}`.toLowerCase(),
    };
  });

  const categoryMap = new Map<string, number>();
  for (const widget of widgets) {
    categoryMap.set(widget.category, (categoryMap.get(widget.category) ?? 0) + 1);
  }

  const categories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b));
  const categoriesBySize = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
  const modes = Array.from(
    new Set(widgets.map((widget) => widget.defaultMode)),
  ) as XyteWidgetMode[];

  const stats: DocsStats = {
    widgetCount: widgets.length,
    categoryCount: categories.length,
    themeCount: XYTE_THEMES.length,
    modeCount: modes.length,
    controlCount: widgets.reduce((total, widget) => total + widget.controls.length, 0),
  };

  return {
    widgets,
    categories,
    categoriesBySize,
    themeNames: XYTE_THEMES.map((theme) => theme.name),
    modes,
    stats,
  };
};
