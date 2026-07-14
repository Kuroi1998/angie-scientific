import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  /** Human-readable name of the module this boundary protects, shown in the fallback UI. */
  label: string;
  /** French/Spanish explanation shown under the title. */
  description?: string;
  /** If provided, renders a secondary button (e.g. "back to the periodic table"). */
  onNavigateHome?: () => void;
  homeLabel?: string;
  /**
   * When this value changes (e.g. the active tab id), a previously caught
   * error is cleared automatically so switching away and back gives a fresh
   * mount instead of staying stuck on the fallback forever.
   */
  resetKey?: unknown;
  /** Translated text for the title prefix. */
  titlePrefix?: string;
  /** Translated text for the retry button. */
  retryLabel?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
  lastResetKey: unknown;
}

const isDev = typeof import.meta !== 'undefined' && Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, lastResetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  // Clears a previously caught error when `resetKey` changes (e.g. the user
  // switched tabs away and back), instead of resetting via componentDidUpdate
  // + setState, which would trigger an extra render pass.
  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.lastResetKey) {
      return { error: null, lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Technical details always go to the console for whoever has devtools open;
    // nothing about the stack is ever rendered to the DOM in production (see render()).
    console.error(`[ErrorBoundary:${this.props.label}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return React.createElement('div', {
      className: 'glass-panel animate-fade-in',
      role: 'alert',
      style: {
        padding: '32px 24px',
        margin: '20px 0',
        background: 'rgba(255, 0, 127, 0.03)',
        border: '1px solid var(--neon-magenta)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '14px'
      }
    },
      React.createElement(AlertTriangle, { size: 32, style: { color: 'var(--neon-magenta)' } }),
      React.createElement('h3', {
        style: {
          fontFamily: 'var(--font-title)',
          fontSize: '15px',
          letterSpacing: '1px',
          color: 'var(--text-primary)',
          margin: 0
        }
      }, `${this.props.titlePrefix || 'UNE ERREUR EST SURVENUE'} — ${this.props.label.toUpperCase()}`),
      React.createElement('p', {
        style: { fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: '1.5', margin: 0 }
      },
        this.props.description ||
        'Ce module a rencontré un problème inattendu et a été arrêté pour préserver le reste de l\'application. Vos données enregistrées ne sont pas affectées.'
      ),
      React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' } },
        React.createElement('button', {
          onClick: this.handleRetry,
          style: {
            padding: '10px 18px',
            background: 'rgba(0, 243, 255, 0.08)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '4px',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-title)',
            fontSize: '13px',
            cursor: 'pointer'
          }
        },
          React.createElement(RotateCcw, { size: 14, style: { marginRight: '6px', verticalAlign: 'middle' } }),
          this.props.retryLabel || 'Réessayer'
        ),
        this.props.onNavigateHome && React.createElement('button', {
          onClick: this.props.onNavigateHome,
          style: {
            padding: '10px 18px',
            background: 'transparent',
            border: '1px solid var(--glass-border)',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '13px',
            cursor: 'pointer'
          }
        },
          React.createElement(Home, { size: 14, style: { marginRight: '6px', verticalAlign: 'middle' } }),
          this.props.homeLabel || "Retour à l'accueil"
        )
      ),
      isDev && React.createElement('pre', {
        style: {
          marginTop: '10px',
          padding: '12px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '4px',
          fontSize: '10px',
          color: 'var(--neon-yellow)',
          maxWidth: '100%',
          overflowX: 'auto',
          textAlign: 'left',
          whiteSpace: 'pre-wrap'
        }
      }, `${error.name}: ${error.message}\n${error.stack || ''}`)
    );
  }
}
