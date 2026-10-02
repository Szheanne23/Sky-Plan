import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardContent } from '../components/common/Card';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full text-center p-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-sm text-slate-500">
          The page or route you requested does not exist in the SkyPlan application shell.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home} size="md">
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
