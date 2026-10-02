import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardContent } from '../components/common/Card';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full text-center p-8 space-y-4 border-white/10 shadow-glass">
        <div className="w-16 h-16 rounded-full bg-surface-container-high/90 border border-primary/20 text-primary mx-auto flex items-center justify-center shadow-glow">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">
          Coordinate Lost
        </h2>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
          The atmospheric route or screen you requested does not exist in the SkyPlan application shell.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="primary" icon={Home} size="md">
              Return to Weather Command Center
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
