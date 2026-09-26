import React, { useState } from 'react';
import { Check, ShieldCheck, Calculator, ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../data/kollavoStore';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  // Budget Calculator State (Prompt Section 44)
  const [numCreators, setNumCreators] = useState<number>(3);
  const [ratePerCreator, setRatePerCreator] = useState<number>(1200);
  const [currency, setCurrency] = useState<string>('USD');

  const creatorTotal = numCreators * ratePerCreator;
  const platformFee = Math.round(creatorTotal * 0.05); // 5% brand fee
  const totalBudget = creatorTotal + platformFee;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Transparent Commercial Structure
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Fair Pricing. Zero Hidden Fees.
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Creators keep 100% of their agreed commercial rates. Brands pay a transparent 5% platform fee for full escrow protection, legal agreements, and workspace tools.
          </p>
        </div>

        {/* Two-Sided Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Creator Plan */}
          <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-500 font-bold block">
                FOR CREATORS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono">0%</span>
                <span className="text-xs text-[var(--color-text-muted)]">Platform Deductions</span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                You retain 100% of the compensation agreed with brands. Payouts arrive directly into your local bank or Stripe Connect account.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                {[
                  'Custom Public Profile & Dynamic Media Kit URL',
                  'Social Analytics Sync (Instagram, TikTok, YouTube)',
                  'Custom Rate Card Builder & Service Packages',
                  'Kollavo Escrow Guarantee on Confirmed Deals',
                  'Content Approval Workspace & Revision History',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="md" onClick={() => onNavigate('/signup')} className="w-full">
              <span>Create Free Creator Profile</span>
            </Button>
          </div>

          {/* Brand Plan */}
          <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[#38BDF8]/40 space-y-6 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#38BDF8] font-bold block">
                FOR BRANDS & AGENCIES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono">5%</span>
                <span className="text-xs text-[var(--color-text-muted)]">Flat Platform Escrow Fee</span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Paid only on funded deals. Covers escrow security, digital contract generation, Google Workspace sync, and revision tracking.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                {[
                  'Full Creator Discovery Roster & Advanced Filters',
                  'Transparent Match Fit Indicators (No Black Box)',
                  'AI Campaign Brief Generator (Powered by Gemini)',
                  'Milestone-Based Escrow Fund Protection',
                  'Google Sheets & Google Drive Roster Sync',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="primary" size="md" onClick={() => onNavigate('/signup')} className="w-full">
              <span>Start as a Brand Partner</span>
            </Button>
          </div>
        </div>

        {/* Interactive Campaign Budget Calculator (Prompt Section 44) */}
        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-lg font-bold">Campaign Budget & Fee Calculator</h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Calculate your total campaign outlay with full platform transparency before initiating creator agreements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Number of Creators
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numCreators}
                onChange={(e) => setNumCreators(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Agreed Rate per Creator
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={ratePerCreator}
                onChange={(e) => setRatePerCreator(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Settlement Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--color-text-primary)] cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breakdown Result */}
          <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Total Creator Compensation
              </span>
              <span className="text-lg font-bold font-mono text-[var(--color-text-primary)]">
                {formatCurrency(creatorTotal, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                5% Platform Escrow Fee
              </span>
              <span className="text-lg font-bold font-mono text-[#38BDF8]">
                {formatCurrency(platformFee, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Total Campaign Outlay
              </span>
              <span className="text-xl font-extrabold font-mono text-emerald-500">
                {formatCurrency(totalBudget, currency)}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
