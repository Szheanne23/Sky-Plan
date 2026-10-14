import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful login
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = location.state?.from?.pathname
    ? (location.state.from.pathname + (location.state.from.search || ''))
    : (redirectParam || '/itineraries');

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Header Badge & Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high/90 border border-primary/20 text-primary text-xs font-semibold shadow-specular-inset">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Registered Member Access</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">
          Sign In to SkyPlan
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
          Access your personalized activity plans, saved locations, and interest tags.
        </p>
      </div>

      {/* Atmospheric Frosted Login Card */}
      <Card className="border-white/10 shadow-glass overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-surface-container-low/50">
          <CardTitle className="text-base flex items-center gap-2">
            <LogIn className="w-4 h-4 text-primary" />
            Account Authentication
          </CardTitle>
          <CardDescription>Enter your credentials to securely restore your session.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errorMessage && (
              <Alert variant="error" title="Sign In Error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Email Address"
              id="login-email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: null }));
              }}
              error={validationErrors.email}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              id="login-password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: null }));
              }}
              error={validationErrors.password}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={ArrowRight}
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Sign In to Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-surface-container-lowest/70 border-t border-white/5 py-4 flex items-center justify-center text-xs text-outline">
          <span>Don't have an account yet?</span>
          <Link
            to={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
            className="ml-2 font-semibold text-primary hover:text-primary-300 transition-colors"
          >
            Create Account &rarr;
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
