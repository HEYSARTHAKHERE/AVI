import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Check, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    { num: '01', title: 'Campaign Created', desc: 'Brand outlines objectives, deliverables, timeline, usage rights, and budget in a structured brief with AI assistance.' },
    { num: '02', title: 'Creator Discovery', desc: 'Brands filter through verified creator profiles with transparent fit metrics; creators browse open public briefs.' },
    { num: '03', title: 'Invitation / Application', desc: 'Creators submit custom proposals and compensation requests; brands can send direct collaboration invites.' },
    { num: '04', title: 'Transparent Review', desc: 'Brand reviews applications using transparent factors (niche, location, verified metrics) without black-box scores.' },
    { num: '05', title: 'Negotiation', desc: 'Deliverables, milestones, and usage rights are discussed and negotiated directly within MAVORA messaging.' },
    { num: '06', title: 'Formal Offer', desc: 'Brand submits an immutable offer with specific deliverable checklist, deadline, and agreed payout amount.' },
    { num: '07', title: 'Creator Acceptance', desc: 'Creator accepts terms, initiating escrow funding to ensure guaranteed payment upon deliverable completion.' },
    { num: '08', title: 'Escrow Funded Agreement', desc: 'Commercial agreement is timestamped and recorded in the audit ledger; funds are securely locked in escrow.' },
    { num: '09', title: 'Content Creation', desc: 'Creator produces the requested media according to brand guidelines and approved creative direction.' },
    { num: '10', title: 'Draft Submission', desc: 'Creator uploads video cuts, raw photo assets, or copy into the MAVORA Content Approval Workspace.' },
    { num: '11', title: 'Review & Revision Loop', desc: 'Brand reviews versioned drafts with timestamped feedback; revisions are tracked with clear audit trails.' },
    { num: '12', title: 'Asset Approval', desc: 'Brand officially marks the final asset as approved. Changes are locked, preparing for scheduled publication.' },
    { num: '13', title: 'Publication & Verification', desc: 'Creator posts the approved content to verified social channels with requested tracking links/tags.' },
    { num: '14', title: 'Escrow Release & Review', desc: 'Escrow funds release automatically to creator balance; mutual verified collaboration reviews are submitted.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            The Collaboration Protocol
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How MAVORA Works
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            The end-to-end 14-step workflow engineered to eliminate ambiguity, guarantee payment security, and streamline commercial creator-brand partnerships.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#38BDF8]">
                  STEP {s.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]/40"></span>
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                {s.title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust & Escrow Guarantee Box */}
        <div className="p-8 rounded-3xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Unfunded Work Guarantee</span>
            </div>
            <h3 className="text-xl font-bold">100% Escrow Protection for Creators & Brands</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Creators never start production without funded escrow. Brands never release funds until approved deliverables are received according to agreement terms.
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={() => onNavigate('/signup')}>
            <span>Get Started with MAVORA</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
