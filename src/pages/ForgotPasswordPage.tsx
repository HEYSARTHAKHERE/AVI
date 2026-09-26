import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPasswordForEmail(email.trim());
      // Always show safe confirmation regardless of whether email exists to prevent enumeration
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
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

          <button
            onClick={() => onNavigate('/login')}
            className="text-xs text-[#575762] hover:text-[#141416] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Log in
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-6 sm:p-8 text-left">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#8EA633]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#141416]">
                  Password reset link sent
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#575762] leading-relaxed">
                  If an account exists for <strong className="text-[#141416]">{email}</strong>, you will receive an email with instructions to securely reset your password.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] rounded-xl text-xs text-[#575762] text-left space-y-1">
                <p>• The reset link remains valid for 1 hour.</p>
                <p>• Check your spam or promotions folder if you don't see it.</p>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => onNavigate('/login')}
                >
                  Return to Log in
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                  Reset your password.
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#575762]">
                  Enter the email associated with your Kollavo account and we'll send you a password reset link.
                </p>
              </div>

              {errorMessage && (
                <div
                  className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-start gap-2.5"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Account Email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                  required
                />

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
                        <span>Sending reset link...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Send reset link</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-[#575762]">
                Remember your password?{' '}
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
      </main>

      <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
        Kollavo Creator Operating System · Phase 2 Secure Authentication
      </footer>
    </div>
  );
};
