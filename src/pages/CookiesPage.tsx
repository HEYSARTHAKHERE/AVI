import React, { useState } from 'react';
import { Cookie, Check } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface CookiesPageProps {
  onNavigate: (path: string) => void;
}

export const CookiesPage: React.FC<CookiesPageProps> = ({ onNavigate }) => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    functional: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Cookie Policy & Consent
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cookie Preferences
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            We use strictly necessary cookies to keep you signed in, persist your midnight-blue theme choices, and secure payments. Manage your preferences below.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="text-xs font-bold block">Essential & Security Cookies</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Required for authentication sessions, CSRF prevention, and escrow security. Cannot be disabled.
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="text-xs font-bold block">Functional & Theme Cookies</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Remembers your Dark/Light theme mode, sidebar collapse state, and active currency selection.
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="w-4 h-4 accent-[#38BDF8]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">Telemetry Performance Cookies</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Anonymized page load metrics to diagnose API latency and mobile responsiveness.
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-[#38BDF8]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Preferences Saved
              </span>
            ) : <span />}

            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Cookie Preferences
            </Button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
