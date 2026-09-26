import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Check, ArrowRight, User, AtSign, Mail, Lock, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  prefilledUsername?: string;
  onSuccess: (userData: { name: string; username: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  prefilledUsername = '',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    username: prefilledUsername || '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  // Sync initialMode when modal opens
  React.useEffect(() => {
    setMode(initialMode);
    if (prefilledUsername) {
      setFormData((prev) => ({ ...prev, username: prefilledUsername }));
    }
  }, [initialMode, prefilledUsername, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters.');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessNotice(true);
      setTimeout(() => {
        setShowSuccessNotice(false);
        onClose();
        onSuccess({
          name: formData.name || 'Sarthak Kamdi',
          username: formData.username || 'sarthak',
          email: formData.email,
        });
      }, 1200);
    }, 800);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      onSuccess({
        name: 'Sarthak Kamdi',
        username: 'sarthak',
        email: 'sarthakkamdi70@gmail.com',
      });
    }, 400);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signup' ? 'Create your MAVORA account' : 'Welcome back to MAVORA'}
      description={
        mode === 'signup'
          ? 'Join the operating system for professional creators and influencers.'
          : 'Log in to manage your active collaborations and media kit.'
      }
      maxWidth="md"
    >
      {showSuccessNotice ? (
        <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#141416]">
            {mode === 'signup' ? 'Account Created Successfully!' : 'Signed in!'}
          </h3>
          <p className="text-xs text-[#575762]">
            Preparing your creator workspace...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Demo Sign-in Button */}
          <div className="p-3 bg-[#FAF9F5] border border-[rgba(20,20,22,0.08)] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8EA633]" />
              <div className="text-left">
                <span className="text-xs font-semibold text-[#141416] block">
                  Quick Demo Access
                </span>
                <span className="text-[11px] text-[#575762]">
                  Explore as Sarthak Kamdi (/creator/sarthak)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-xs font-semibold px-3 py-1.5 bg-[#FFFFFF] border border-[rgba(20,20,22,0.12)] rounded-lg text-[#141416] hover:bg-[#F3F1EC] transition-colors"
            >
              Sign in as Demo
            </button>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-[rgba(20,20,22,0.08)] w-full"></div>
            <span className="bg-white px-3 text-[11px] text-[#888894] uppercase tracking-wider absolute">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Sarthak Kamdi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Claimed Handle / Username"
                  type="text"
                  placeholder="e.g. sarthak"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                    })
                  }
                  helperText="Your public profile will be mavora.com/creator/[username]"
                  leftIcon={<AtSign className="w-4 h-4" />}
                  required
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : mode === 'signup' ? (
                  <>
                    <span>Create Creator Account</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </div>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-center pt-2 text-xs text-[#575762]">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#141416] hover:underline"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#141416] hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
};
