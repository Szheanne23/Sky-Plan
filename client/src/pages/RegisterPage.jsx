import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
      {/* Header Badge & Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high/90 border border-primary/20 text-primary text-xs font-semibold shadow-specular-inset">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>New Account Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">
          Create SkyPlan Account
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
          Join to unlock personalized activity recommendations and sync saved places.
        </p>
      </div>

      {/* Atmospheric Frosted Registration Card */}
      <Card className="border-white/10 shadow-glass overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-surface-container-low/50">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            User Registration
          </CardTitle>
          <CardDescription>Fill in your profile details to create your secure identity.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errorMessage && (
              <Alert variant="error" title="Registration Error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Display Name"
              id="register-name"
              type="text"
              placeholder="e.g. Alex Rivera"
              icon={User}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (validationErrors.displayName) setValidationErrors((prev) => ({ ...prev, displayName: null }));
              }}
              error={validationErrors.displayName}
              autoComplete="name"
              required
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
              required
            />

            <Input
              label="Password"
              id="register-password"
              type="password"
              placeholder="At least 6 characters"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: null }));
              }}
              error={validationErrors.password}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm Password"
              id="register-confirm-password"
              type="password"
              placeholder="Re-type your password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={validationErrors.confirmPassword}
              autoComplete="new-password"
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
              Complete Registration
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-surface-container-lowest/70 border-t border-white/5 py-4 flex items-center justify-center text-xs text-outline">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="ml-2 font-semibold text-primary hover:text-primary-300 transition-colors"
          >
            Sign In Instead &rarr;
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
