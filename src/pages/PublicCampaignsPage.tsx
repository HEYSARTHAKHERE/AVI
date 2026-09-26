import React, { useState } from 'react';
import { Briefcase, Search, Sparkles, Clock, CheckCircle2, ArrowRight, DollarSign, Send, X } from 'lucide-react';
import { mavoraStore, formatCurrency, Campaign } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface PublicCampaignsPageProps {
  onNavigate: (path: string) => void;
}

export const PublicCampaignsPage: React.FC<PublicCampaignsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled } = useMode();
  const { status, profile, signInDemoUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [proposalRate, setProposalRate] = useState<number>(1400);
  const [proposalText, setProposalText] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const campaigns = mavoraStore.getCampaigns(isDemoDataEnabled);

  const filtered = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productService.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setProposalRate(camp.budget);
    setProposalText(`Hi ${camp.brandName} team! I would love to collaborate on the ${camp.title}. My audience aligns directly with ${camp.targetNiches.join(' and ')}, and I will deliver high-fidelity 4K assets on time.`);
    setApplicationSubmitted(false);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    if (status !== 'authenticated') {
      signInDemoUser(true, 'creator');
    }

    mavoraStore.addApplication({
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      brandName: selectedCampaign.brandName,
      creatorId: profile?.id || 'usr_sarthak_01',
      creatorName: profile?.full_name || 'Sarthak Kamdi',
      creatorUsername: profile?.username || 'sarthak',
      creatorAvatar: profile?.avatar_url || '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
      proposalText,
      requestedRate: proposalRate,
      currency: selectedCampaign.currency,
      status: 'Applied',
      fitFactors: {
        nicheMatchPercent: 95,
        locationMatch: true,
        platformMatch: true,
        budgetCompatible: true,
        verifiedSocials: true,
        explanation: 'Strong niche match · Verified social connection active · Budget within campaign range.',
      },
    });

    setApplicationSubmitted(true);
    setTimeout(() => {
      setSelectedCampaign(null);
      setApplicationSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="max-w-3xl mb-10 space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Campaign Board · Active Brand Briefs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Open Creator Collaboration Briefs
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Apply to verified campaigns funded with MAVORA escrow protection. Transparent deliverable requirements, timeline milestones, and guaranteed payout schedules.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm mb-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search briefs by campaign name, brand, or product..."
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>

        {/* Campaign Briefs Grid */}
        <div className="space-y-4">
          {filtered.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[#38BDF8]/40 transition-all shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 uppercase">
                    {camp.templateType}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    {camp.brandName}
                  </span>
                  <span className="text-[var(--color-text-muted)]">·</span>
                  <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {camp.deadline}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {camp.title}
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <span><strong>Deliverables:</strong> {camp.deliverables.join(' · ')}</span>
                  <span><strong>Platforms:</strong> {camp.platforms.join(', ')}</span>
                  <span><strong>Applicants:</strong> {camp.applicantsCount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[var(--color-border-subtle)]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                    Budget per creator
                  </span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    {formatCurrency(camp.budget, camp.currency)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApplyClick(camp)}
                  className="w-full sm:w-auto"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Apply with Proposal</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Application Submission Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 text-left">
          <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute right-4 top-4 text-[#94A3B8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {applicationSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Proposal Dispatched!</h3>
                <p className="text-xs text-[#94A3B8]">
                  Your application for {selectedCampaign.title} has been logged in MAVORA with transparent fit indicators.
                </p>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                    Collaboration Application
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">{selectedCampaign.brandName}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Requested Compensation ({selectedCampaign.currency})
                  </label>
                  <input
                    type="number"
                    value={proposalRate}
                    onChange={(e) => setProposalRate(Number(e.target.value))}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                    required
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Campaign target: {formatCurrency(selectedCampaign.budget, selectedCampaign.currency)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Proposal Pitch & Creative Concept
                  </label>
                  <textarea
                    rows={4}
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8] resize-none"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCampaign(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    <span>Submit Proposal</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
