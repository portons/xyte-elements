import { useEffect, useMemo, useState } from 'react';

import type {
  ThemeId,
  ViewportPreset,
  WidgetControlSpec,
  XyteWidgetMode,
} from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { setWidgetRuntimeTheme } from '../widgets/library';
import {
  getWidgetStory,
  WIDGET_CATEGORIES,
  WIDGET_STORIES,
} from '../widgets/registry';

interface ExplorerPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  viewport: ViewportPreset;
  widgetId: string;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewportChange: (viewport: ViewportPreset) => void;
  onWidgetChange: (widgetId: string) => void;
  onViewChange: (view: 'dashboard' | 'explorer') => void;
}

function renderControl(
  control: WidgetControlSpec,
  value: unknown,
  onChange: (nextValue: unknown) => void,
) {
  if (control.kind === 'boolean') {
    return (
      <label className="xyte-control" key={control.key}>
        <span>{control.label}</span>
        <input
          type="checkbox"
          name={control.key}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
      </label>
    );
  }

  if (control.kind === 'number') {
    const min = control.min ?? 0;
    const max = control.max ?? 100;
    const step = control.step ?? 1;
    const numericValue =
      typeof value === 'number' && Number.isFinite(value) ? value : min;

    return (
      <label className="xyte-control" key={control.key}>
        <span>
          {control.label}: <strong>{numericValue}</strong>
        </span>
        <input
          type="range"
          name={control.key}
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }

  const options = control.options ?? [];
  return (
    <label className="xyte-control" key={control.key}>
      <span>{control.label}</span>
      <select
        name={control.key}
        value={String(value ?? options[0]?.value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ExplorerPage({
  themeId,
  mode,
  viewport,
  widgetId,
  onThemeChange,
  onModeChange,
  onViewportChange,
  onWidgetChange,
  onViewChange,
}: ExplorerPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const selectedStory = getWidgetStory(widgetId);
  const [storyProps, setStoryProps] = useState<Record<string, unknown>>(
    selectedStory.defaultProps,
  );

  useEffect(() => {
    setStoryProps(getWidgetStory(widgetId).defaultProps);
  }, [widgetId]);

  const filteredStories = useMemo(
    () =>
      WIDGET_STORIES.filter((story) => {
        const categoryMatch = category === 'all' || story.category === category;
        const searchMatch =
          story.title.toLowerCase().includes(search.toLowerCase()) ||
          story.id.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [category, search],
  );

  const canvasClass = viewport === 'mobile' ? 'xyte-canvas xyte-canvas--mobile' : 'xyte-canvas';

  return (
    <div className="xyte-shell" data-theme={themeId} data-mode={mode}>
      <div className="xyte-toolbar xyte-toolbar--sticky">
        <div className="xyte-toolbar__left">
          <button className="xyte-tab" type="button" onClick={() => onViewChange('dashboard')}>
            Dashboard
          </button>
          <button className="xyte-tab xyte-tab--active" type="button">
            Explorer
          </button>
        </div>

        <div className="xyte-toolbar__right">
          <label className="xyte-field">
            <span>Theme</span>
            <select
              name="theme"
              value={themeId}
              onChange={(event) => onThemeChange(event.target.value as ThemeId)}
            >
              {XYTE_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </label>

          <label className="xyte-field">
            <span>Mode</span>
            <select
              name="mode"
              value={mode}
              onChange={(event) => onModeChange(event.target.value as XyteWidgetMode)}
            >
              <option value="legacy">Legacy</option>
              <option value="modern">Modern</option>
            </select>
          </label>

          <label className="xyte-field">
            <span>Viewport</span>
            <select
              name="viewport"
              value={viewport}
              onChange={(event) =>
                onViewportChange(event.target.value as ViewportPreset)
              }
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </label>
        </div>
      </div>

      <div className="xyte-explorer-layout">
        <aside className="xyte-explorer-panel xyte-explorer-panel--left">
          <h2>Widgets</h2>

          <label className="xyte-field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {WIDGET_CATEGORIES.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <label className="xyte-field">
            <span>Search</span>
            <input
              type="search"
              name="story_search"
              autoComplete="off"
              spellCheck={false}
              value={search}
              placeholder="Find widget…"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="xyte-story-list" role="listbox" aria-label="Widget story list">
            {filteredStories.map((story) => (
              <button
                key={story.id}
                className={story.id === selectedStory.id ? 'xyte-story xyte-story--active' : 'xyte-story'}
                type="button"
                onClick={() => onWidgetChange(story.id)}
              >
                <strong>{story.title}</strong>
                <span>{story.category}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="xyte-explorer-preview">
          <div className="xyte-preview-header">
            <div>
              <h3>{selectedStory.title}</h3>
              <p>{selectedStory.id}</p>
            </div>
            <button
              className="xyte-tab"
              type="button"
              onClick={() => setStoryProps(selectedStory.defaultProps)}
            >
              Reset Props
            </button>
          </div>

          <div className={canvasClass}>
            <div
              data-widget-root
              data-widget-id={selectedStory.id}
              data-mode={mode}
              data-theme={themeId}
              className="xyte-widget-wrap"
            >
              {selectedStory.render(storyProps)}
            </div>
          </div>
        </main>

        <aside className="xyte-explorer-panel xyte-explorer-panel--right">
          <h2>Props</h2>
          {selectedStory.controls.length === 0 ? (
            <p className="xyte-muted">No public props in this story.</p>
          ) : (
            selectedStory.controls.map((control) =>
              renderControl(control, storyProps[control.key], (nextValue) =>
                setStoryProps((prev) => ({ ...prev, [control.key]: nextValue })),
              ),
            )
          )}
        </aside>
      </div>
    </div>
  );
}
