import React, { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';
import Card, { CardContent } from './Card';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SkyPlan App Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-on-surface">
          <Card className="max-w-md w-full text-center p-8 space-y-4 border-white/10 shadow-glass">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center shadow-glow">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-on-surface tracking-tight">
              Operational Stability Safeguard
            </h2>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              SkyPlan has prevented an unhandled view error. The shell remains secure and operational.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                variant="primary"
                icon={RotateCcw}
                size="sm"
                onClick={this.handleReload}
                className="w-full sm:w-auto"
              >
                Reload Application
              </Button>
              <Button
                variant="secondary"
                icon={Home}
                size="sm"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
