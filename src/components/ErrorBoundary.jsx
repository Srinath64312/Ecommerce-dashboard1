import React from 'react';

/**
 * Catches render-time errors so a failure in one section shows a recoverable
 * message instead of unmounting the whole dashboard into a blank page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(`[${this.props.label || 'App'}] Render error:`, error, info?.componentStack);
    this.props.onError?.(error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="empty-state" role="alert">
        <div className="empty-title">Something went wrong</div>
        <div className="empty-desc">{error.message || 'An unexpected error occurred.'}</div>
        <button
          className="btn btn-secondary btn-sm"
          style={{ marginTop: '0.75rem' }}
          onClick={() => this.setState({ error: null })}
        >
          Try again
        </button>
      </div>
    );
  }
}
