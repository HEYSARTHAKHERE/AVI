import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/auth/PasswordInput';
import { Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  redirectTo?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  redirectTo = '/dashboard',
}) => {
  const { logIn, signInWithGoogle, signInDemoUser, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await logIn({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (!res.success) {
        setFormError(res.error || 'Invalid email or password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Successful login -> route to onboarding if profile incomplete, else original destination or /dashboard
      const target = res.redirectTo || redirectTo || '/dashboard';
      onNavigate(target);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your connection.';
      setFormError(msg);
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    signInDemoUser();
    onNavigate(redirectTo || '/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[rgba(20,20,22,0.06)] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
            Kollavo
          </button>

          <div className="text-xs text-[#575762]">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="font-semibold text-[#141416] hover:underline ml-1"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-6 sm:p-8">
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
              Welcome back.
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#575762]">
              Log in to continue building your creator presence.
            </p>
          </div>

          {formError && (
            <div
              className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={async () => {
              setIsSubmitting(true);
              setFormError(null);
              const res = await signInWithGoogle();
              if (res.success) {
                onNavigate(res.redirectTo || redirectTo || '/dashboard');
              } else {
                setFormError(res.error || 'Google Sign-in was not completed.');
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="w-full py-2.5 px-3 bg-white hover:bg-[#F3F1EC] border border-[rgba(20,20,22,0.12)] rounded-xl text-xs font-semibold text-[#141416] flex items-center justify-center gap-2.5 transition-colors mb-5 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(20,20,22,0.08)]" />
            </div>
            <span className="relative bg-white px-2 text-[11px] text-[#888894] uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#141416]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-[#575762] hover:text-[#141416] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#575762]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[rgba(20,20,22,0.2)] text-[#8EA633] focus:ring-[#8EA633]"
                />
                <span>Remember session</span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Log in</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Demo Login Option for review */}
          <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)]">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 bg-[#FAF9F5] hover:bg-[#F3F1EC] border border-[rgba(20,20,22,0.08)] rounded-xl text-xs font-semibold text-[#141416] flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Instant Demo Login (Sarthak Kamdi)</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[#575762]">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="font-semibold text-[#141416] hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
        Kollavo Creator Operating System · Phase 2 Secure Authentication
      </footer>
    </div>
  );
};
