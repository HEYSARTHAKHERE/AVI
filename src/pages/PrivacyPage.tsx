import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">
            Last Updated: September 26, 2026 · GDPR & CCPA Compliant
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 text-xs text-[var(--color-text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">1. Data Minimization & Principles</h2>
            <p>
              Kollavo collects only information necessary to deliver creator profile creation, verified social telemetry benchmarking, and escrow collaboration processing. We do not sell user data to advertising brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">2. Social Media & Google Workspace OAuth</h2>
            <p>
              When connecting third-party platforms (Instagram Graph API, TikTok Creator API, YouTube Data API, or Google Workspace), authentication is conducted via standard OAuth 2.0. We request minimum read permissions for public metrics. We NEVER store social passwords, raw credit card numbers, or private communications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">3. Data Retention & Deletion Rights</h2>
            <p>
              Users hold the right to disconnect any social or workspace integration instantly through the Account Settings. You may request complete account data deletion at any time by contacting privacy@kollavo.ai. Upon receipt, all profile records and synced analytics are purged within 30 calendar days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">4. Payment & Financial Ledger Security</h2>
            <p>
              All payments, escrow holdings, and creator payouts are facilitated via regulated payment processors (Stripe Payments & Connect). Kollavo stores double-entry ledger references and transaction identifiers for tax compliance without maintaining raw financial credentials.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
