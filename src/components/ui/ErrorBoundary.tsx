'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-black/40">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-6">
              We encountered an error while loading this page. Please try refreshing or go back to the previous page.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-transparent border border-white/20 hover:border-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error fallback component
export const SimpleErrorFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-black/40">
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
      <div className="text-3xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-3">Loading Error</h3>
      <p className="text-white/70 mb-4">Failed to load this page</p>
      <button
        onClick={resetError}
        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);
