import type { ExplorerView, ThemeId, XyteWidgetMode } from '../explorer/types';
import { XYTE_THEMES } from '../theme/themes';
import { DashboardContent, setWidgetRuntimeTheme } from '../widgets/library';

interface DashboardPageProps {
  themeId: ThemeId;
  mode: XyteWidgetMode;
  onThemeChange: (themeId: ThemeId) => void;
  onModeChange: (mode: XyteWidgetMode) => void;
  onViewChange: (view: ExplorerView) => void;
}

export function DashboardPage({
  themeId,
  mode,
  onThemeChange,
  onModeChange,
  onViewChange,
}: DashboardPageProps) {
  setWidgetRuntimeTheme(themeId, mode);

  return (
    <div className="xyte-shell" data-theme={themeId} data-mode={mode}>
      <div className="xyte-toolbar xyte-toolbar--sticky">
        <div className="xyte-toolbar__left">
          <button
            className="xyte-tab"
            type="button"
            onClick={() => onViewChange('landing')}
          >
            Landing
          </button>
          <button
            className="xyte-tab"
            type="button"
            onClick={() => onViewChange('docs')}
          >
            Docs
          </button>
          <button className="xyte-tab xyte-tab--active" type="button">
            Dashboard
          </button>
          <button
            className="xyte-tab"
            type="button"
            onClick={() => onViewChange('gallery')}
          >
            Gallery
          </button>
          <button
            className="xyte-tab"
            type="button"
            onClick={() => onViewChange('explorer')}
          >
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
        </div>
      </div>

      <DashboardContent />
    </div>
  );
}
