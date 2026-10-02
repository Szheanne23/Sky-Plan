import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
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
  const from = location.state?.from?.pathname || '/profile';

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
        setErrorMessage(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Registered Access</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-sm text-slate-500">Sign in to manage your interest preferences and personalized plans.</p>
      </div>

      <Card className="border-sky-100 shadow-glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-50/50 via-white to-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <LogIn className="w-4 h-4 text-sky-600" />
            Account Authentication
          </CardTitle>
          <CardDescription>Enter your verified credentials below.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errorMessage && (
              <Alert variant="error" title="Authentication Failed" onClose={() => setErrorMessage(null)}>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                isLoading={isSubmitting}
                icon={ArrowRight}
              >
                Sign In
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-xs text-slate-500">
          <span>Don't have an account yet?</span>
          <Link to="/register" className="ml-1.5 font-semibold text-sky-600 hover:text-sky-700 hover:underline">
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
