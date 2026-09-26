import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkUsernameAvailability, isSupabaseConfigured } from '../lib/supabase/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/auth/PasswordInput';
import { 
  Check, 
  ArrowRight, 
  User, 
  AtSign, 
  Mail, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SignupPageProps {
  onNavigate: (path: string) => void;
  prefilledUsername?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigate,
  prefilledUsername = '',
}) => {
  const { signUp, signInWithGoogle, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(prefilledUsername);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'invalid' | 'taken'>('idle');
  const [usernameMessage, setUsernameMessage] = useState<string>('');

  // General form feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Debounced username checking
  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    const normalized = username.trim().toLowerCase();
    const formatRegex = /^[a-z0-9_.]{3,30}$/;

    if (!formatRegex.test(normalized)) {
      setUsernameStatus('invalid');
      if (normalized.length < 3) {
        setUsernameMessage('Minimum 3 characters required');
      } else if (normalized.length > 30) {
        setUsernameMessage('Maximum 30 characters allowed');
      } else {
        setUsernameMessage('Only lowercase letters, numbers, underscores, and periods allowed');
      }
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(normalized);
      if (res.available) {
        setUsernameStatus('available');
        setUsernameMessage(`mavora.com/creator/${normalized} is available`);
      } else {
        setUsernameStatus('taken');
        setUsernameMessage(res.error || 'That username is already taken.');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically sanitize and normalize characters
    const val = e.target.value.toLowerCase().replace(/\s+/g, '');
    setUsername(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (usernameStatus !== 'available') {
      if (usernameStatus === 'taken') {
        setFormError('That username is already taken. Please choose another.');
      } else {
        setFormError('Please provide a valid username.');
      }
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to create account.');
        setIsSubmitting(false);
        return;
      }

      if (res.requiresEmailConfirmation) {
        setRequiresVerification(true);
        setIsSubmitting(false);
      } else {
        // Successful signup with active session -> redirect to onboarding for Phase 3
        onNavigate('/onboarding');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unexpected error during signup.';
      setFormError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-6 border-b border-[rgba(20,20,22,0.06)] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
            MAVORA
          </button>

          <div className="text-xs text-[#575762]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="font-semibold text-[#141416] hover:underline ml-1"
            >
              Log in
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left / Editorial Brand Column (Hidden on small mobile, elegant on lg) */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141416] text-[#FAF9F5] p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8EA633]/15 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8EA633] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phase 2 Auth</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#FAF9F5] leading-snug">
                The operating system for creator-brand collaborations.
              </h2>
              <p className="mt-3 text-xs text-[#888894] leading-relaxed">
                Connect your social statistics, showcase your portfolio, and manage your brand deal pipeline from day one.
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3 text-xs text-[#EBE8E1]">
                <div className="w-4 h-4 rounded-full bg-[#8EA633]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#8EA633]" />
                </div>
                <span>Custom vanity URL (/creator/[username])</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#EBE8E1]">
                <div className="w-4 h-4 rounded-full bg-[#8EA633]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#8EA633]" />
                </div>
                <span>Automated media kit with live stats</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#EBE8E1]">
                <div className="w-4 h-4 rounded-full bg-[#8EA633]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#8EA633]" />
                </div>
                <span>Row Level Security (RLS) protected profile</span>
              </div>
            </div>

            <div className="pt-6 text-[11px] text-[#888894]">
              Supabase Auth Engine · 256-bit encryption
            </div>
          </div>

          {/* Right / Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {requiresVerification ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7 text-[#8EA633]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#141416]">
                  Check your email
                </h3>
                <p className="text-sm text-[#575762] max-w-sm mx-auto leading-relaxed">
                  We've sent a confirmation link to <strong className="text-[#141416]">{email}</strong>. Click the link in your email to activate your account and start your creator profile.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate('/login')}
                  >
                    Go to Log In
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                    Build your creator presence.
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#575762]">
                    Create your MAVORA account and start building your professional creator profile.
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

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    setFormError(null);
                    const res = await signInWithGoogle();
                    if (res.success) {
                      onNavigate(res.redirectTo || '/dashboard');
                    } else {
                      setFormError(res.error || 'Google Sign-up was not completed.');
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
                    Or register with email
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Sarthak Kamdi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    autoComplete="name"
                    required
                  />

                  {/* Username with Live Uniqueness & Format Feedback */}
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-[#141416] mb-1.5">
                      Username / Handle
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-[#888894]">
                        <AtSign className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="sarthak"
                        value={username}
                        onChange={handleUsernameChange}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl pl-10 pr-10 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
                          usernameStatus === 'taken' || usernameStatus === 'invalid'
                            ? 'border-red-500'
                            : usernameStatus === 'available'
                            ? 'border-emerald-600'
                            : 'border-[rgba(20,20,22,0.12)]'
                        }`}
                        required
                      />
                      <div className="absolute right-3.5 flex items-center">
                        {usernameStatus === 'checking' && (
                          <Loader2 className="w-4 h-4 text-[#8EA633] animate-spin" />
                        )}
                        {usernameStatus === 'available' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    {usernameMessage && (
                      <p
                        className={`mt-1 text-xs ${
                          usernameStatus === 'available'
                            ? 'text-emerald-700 font-medium'
                            : 'text-red-600'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </div>

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

                  <PasswordInput
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    showStrengthIndicator
                    autoComplete="new-password"
                    required
                  />

                  <PasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    error={
                      confirmPassword && password !== confirmPassword
                        ? 'Passwords do not match'
                        : undefined
                    }
                    required
                  />

                  <div className="pt-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      type="submit"
                      disabled={isSubmitting || usernameStatus === 'taken' || usernameStatus === 'invalid'}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Create account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center text-xs text-[#575762]">
                  Already have an account?{' '}
                  <button
                    onClick={() => onNavigate('/login')}
                    className="font-semibold text-[#141416] hover:underline"
                  >
                    Log in
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
        MAVORA Creator Operating System · Phase 2 Secure Authentication
      </footer>
    </div>
  );
};
