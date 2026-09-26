import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FOUNDER_METRICS, PLATFORM_TRACTION } from '../data/kollavoStore';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Our Mission & Principles
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Built for Authentic Creative Commerce
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Kollavo was founded to replace chaotic email threads, unverified agency markups, and delayed creator payouts with an integrated, transparent operating system.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#38BDF8]" />
            <h3 className="text-base font-bold">Official APIs Only</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              We never ask for social passwords or scrape private profiles. Every metric is authorized via official Meta, TikTok, and YouTube OAuth credentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <Lock className="w-6 h-6 text-[#38BDF8]" />
            <h3 className="text-base font-bold">Real Data Mandate</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              We prohibit fabricated followers, vanity metrics, or fake reviews. If an integration is pending, we explicitly state "Awaiting Connection".
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <HeartHandshake className="w-6 h-6 text-[#38BDF8]" />
            <h3 className="text-base font-bold">Fair Escrow Protection</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Brand campaign funds are locked in escrow prior to content creation and released immediately upon agreed deliverable approval.
            </p>
          </div>
        </div>

        {/* Founder & Community Disclosure */}
        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
          <span className="text-xs font-mono uppercase text-[#38BDF8]">
            Platform Governance & Transparency
          </span>
          <h2 className="text-xl font-bold">
            Founder Reach vs. Kollavo Platform Metrics
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            In compliance with our strict truth-in-data constitution, founder personal creator community reach ({FOUNDER_METRICS.personalReach}) is strictly segregated from Kollavo platform operational telemetry ({PLATFORM_TRACTION.registeredUsers} registered users, {PLATFORM_TRACTION.completedCollaborations} completed deals). We believe honest foundations build generational platforms.
          </p>
        </div>

        <div className="pt-4 text-center">
          <Button variant="primary" size="lg" onClick={() => onNavigate('/signup')}>
            <span>Join the Kollavo Ecosystem</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
