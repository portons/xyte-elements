export type ExplorerView = 'dashboard' | 'explorer';
export type XyteWidgetMode = 'legacy' | 'modern';

export type ThemeId =
  | 'xyte_classic_dark'
  | 'xyte_ops_light'
  | 'xyte_midnight_haze'
  | 'xyte_graphite_neo'
  | 'xyte_slate_cloud'
  | 'xyte_teal_night';

export type ViewportPreset = 'desktop' | 'mobile';

export interface WidgetControlSpec {
  key: string;
  label: string;
  kind: 'boolean' | 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
}

export interface WidgetStoryDefinition {
  id: string;
  title: string;
  category: string;
  defaultMode: XyteWidgetMode;
  defaultProps: Record<string, unknown>;
  controls: WidgetControlSpec[];
  render: (props: Record<string, unknown>) => JSX.Element;
}
