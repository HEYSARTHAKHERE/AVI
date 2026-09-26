import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

interface HelpPageProps {
  onNavigate: (path: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Kollavo protect creator payments?',
      a: 'When a brand accepts your collaboration proposal or sends an offer, the campaign budget is immediately funded into a secure Kollavo Escrow account. Once you upload deliverables to the Content Approval Workspace and the brand approves them, the escrow funds automatically release to your account balance.',
    },
    {
      q: 'How do social media integrations work? Do you ask for passwords?',
      a: 'Never. Kollavo uses official OAuth 2.0 protocols directly with Meta (Instagram Graph API), TikTok, and Google (YouTube Data API). You authenticate directly on the platform and grant minimum read-only permissions for public follower counts, video views, and engagement benchmarks.',
    },
    {
      q: 'What is the transparent matching system for brands?',
      a: 'Unlike opaque platforms that claim an algorithm has found the "absolute best" creator, Kollavo presents explicit fit factors: Niche Match %, Target Audience Location Match, Platform Compatibility, and Verified Budget Alignment. Brands have full control over what matters most to their campaign.',
    },
    {
      q: 'How does Google Workspace integration assist my workflow?',
      a: 'With Google Workspace connected, brands can export campaign creator rosters directly to Google Sheets with 1 click, creators can sync media kits from Google Drive, and both parties can receive instant deliverable notifications in dedicated Google Chat spaces.',
    },
    {
      q: 'What happens if there is a deliverable dispute?',
      a: 'Both parties can open a case in the Kollavo Dispute Center. Funds remain held securely in escrow while both sides submit evidence (chat history, approved brief terms, uploaded drafts). Our operations team mediates based strictly on the signed collaboration agreement.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Knowledge Base & Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kollavo Help Center
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Everything you need to know about setting up rate cards, connecting official social APIs, funding campaign escrow, and collaborating with global partners.
          </p>
        </div>

        {/* Guides Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-sm font-bold">API Connection Guide</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">How to authorize Instagram, TikTok, and YouTube with minimum read scopes.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Escrow & Payouts</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Understanding deposit milestones, payout timelines, and multi-currency conversions.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <BookOpen className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-sm font-bold">Media Kit Best Practices</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">How to structure high-converting service packages, UGC rates, and portfolio case studies.</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 pt-6 border-t border-[var(--color-border-subtle)]">
          <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-xs sm:text-sm hover:text-[#38BDF8] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openIdx === i ? <ChevronUp className="w-4 h-4 shrink-0 text-[#38BDF8]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#94A3B8]" />}
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-5 text-xs text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-subtle)] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
