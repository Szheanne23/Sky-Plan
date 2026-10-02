import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!displayName.trim()) {
      errors.displayName = 'Display name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      const result = await register(email, password, displayName);
      if (result.success) {
        navigate('/profile', { replace: true });
      } else {
        setErrorMessage(result.error || 'Failed to register account.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>New Account</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create SkyPlan Account</h1>
        <p className="text-sm text-slate-500">Sign up to unlock personalized activity recommendations and save favorite locations.</p>
      </div>

      <Card className="border-sky-100 shadow-glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-50/50 via-white to-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-sky-600" />
            User Registration
          </CardTitle>
          <CardDescription>Fill in your profile and account information.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errorMessage && (
              <Alert variant="error" title="Registration Error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Display Name"
              id="register-displayName"
              placeholder="e.g. Alex Rivera"
              icon={User}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (validationErrors.displayName) setValidationErrors((prev) => ({ ...prev, displayName: null }));
              }}
              error={validationErrors.displayName}
              autoComplete="name"
              disabled={isSubmitting}
            />

            <Input
              label="Email Address"
              id="register-email"
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
              id="register-password"
              type="password"
              placeholder="Minimum 6 characters"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: null }));
              }}
              error={validationErrors.password}
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            <Input
              label="Confirm Password"
              id="register-confirmPassword"
              type="password"
              placeholder="Re-enter password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={validationErrors.confirmPassword}
              autoComplete="new-password"
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
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-xs text-slate-500">
          <span>Already registered?</span>
          <Link to="/login" className="ml-1.5 font-semibold text-sky-600 hover:text-sky-700 hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
