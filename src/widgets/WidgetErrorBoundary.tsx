import React from 'react';

interface Props {
  widgetId?: string;
  resetKeys?: unknown[];
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(`[Widget ${this.props.widgetId ?? '?'}] crashed:`, error.message, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && this.props.resetKeys && prev.resetKeys) {
      const changed = this.props.resetKeys.some((k, i) => k !== prev.resetKeys![i]);
      if (changed) this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', minHeight: 80, padding: 16, gap: 6,
          background: 'rgba(220,38,38,.08)', borderRadius: 8, border: '1px solid rgba(220,38,38,.25)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#dc2626' }}>Widget crashed</span>
          <code style={{ fontSize: 9, color: '#888', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {this.state.error?.message}
          </code>
        </div>
      );
    }
    return this.props.children;
  }
}
