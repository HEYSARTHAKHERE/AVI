import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">
            Effective Date: September 26, 2026
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 text-xs text-[var(--color-text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">1. Platform Relationship</h2>
            <p>
              MAVORA operates as a software facilitation and workflow technology platform connecting independent creative contractors ("Creators") and commercial organizations ("Brands"). MAVORA is not an employer, talent agency, or media publisher.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">2. Content Deliverables & Licensing</h2>
            <p>
              Deliverables created during a collaboration are governed by the specific commercial terms accepted in the MAVORA Collaboration Agreement. Unless explicitly negotiated otherwise, creators retain copyright in their original creative output while granting brands the agreed non-exclusive commercial usage license upon complete payout release.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">3. Escrow Governance & Dispute Resolution</h2>
            <p>
              Brand funds deposited into escrow are held securely until the brand marks deliverables as approved or the agreed review period elapses without dispute. If an issue is reported in the Dispute Center, funds remain locked while evidence is mediated.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
