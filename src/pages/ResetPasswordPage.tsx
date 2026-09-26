import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/auth/PasswordInput';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updatePassword(newPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update password. Link may have expired.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating password.';
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
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-6 sm:p-8 text-left">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#8EA633]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#141416]">
                  Password updated
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#575762] leading-relaxed">
                  Your password has been changed successfully. You can now use your new password to sign into your Kollavo account.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => onNavigate('/dashboard')}
                >
                  <span>Continue to Kollavo</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                  Choose new password.
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#575762]">
                  Create a secure password for your Kollavo creator account.
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
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  showStrengthIndicator
                  autoComplete="new-password"
                  required
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  error={
                    confirmPassword && newPassword !== confirmPassword
                      ? 'Passwords do not match'
                      : undefined
                  }
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
                        <span>Updating password...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Update password</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
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
