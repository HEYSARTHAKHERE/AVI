import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Bookmark, Send, Sparkles, Eye, ArrowRight, Check } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, formatCurrency, Creator } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface FindCreatorsPageProps {
  onNavigate: (path: string) => void;
}

export const FindCreatorsPage: React.FC<FindCreatorsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [inviteModalCreator, setInviteModalCreator] = useState<Creator | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const creators = mavoraStore.getCreators(isDemoDataEnabled);
  const campaigns = mavoraStore.getCampaigns(isDemoDataEnabled);

  const niches = ['All', 'Fashion', 'Beauty', 'Technology', 'Lifestyle', 'Photography'];
  const platforms = ['All', 'Instagram', 'TikTok', 'YouTube'];

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const matchSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNiche = selectedNiche === 'All' || c.category === selectedNiche || c.categories.includes(selectedNiche);
      const matchPlatform =
        selectedPlatform === 'All' ||
        c.socials.some((s) => s.platform.toLowerCase() === selectedPlatform.toLowerCase() && s.connected);
      return matchSearch && matchNiche && matchPlatform;
    });
  }, [creators, searchTerm, selectedNiche, selectedPlatform]);

  const toggleShortlist = (id: string) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => {
      setInviteModalCreator(null);
      setInviteSent(false);
    }, 2000);
  };

  return (
    <DashboardLayout currentPath="/discover-creators" pageTitle="Creator Discovery Engine" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Matching & Discovery</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Discover Verified Commercial Creators
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Search talent with verified OAuth metrics. Match based on explicit criteria: niche synergy, verified audience geography, and transparent rate cards. No black-box algorithms.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, handle, or aesthetic keywords..."
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {niches.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedNiche(n)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedNiche === n
                    ? 'bg-[#38BDF8] text-white'
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => {
            const isShortlisted = shortlistedIds.has(creator.id);
            return (
              <div
                key={creator.id}
                className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border-subtle)]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{creator.fullName}</h4>
                          {creator.verified && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">@{creator.username}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(creator.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isShortlisted
                          ? 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#38BDF8]'
                          : 'bg-white/5 border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-white'
                      }`}
                      title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {creator.bio}
                  </p>

                  {/* Transparent Match Factor Pill (Prompt Section 21 & 56) */}
                  <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] text-[11px] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-bold block">
                      Why this creator fits:
                    </span>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Strong {creator.category} niche match · Located in {creator.location} · {creator.socials[0]?.status === 'VERIFIED' ? 'Instagram verified' : 'Active social connection'} · Starting at {formatCurrency(creator.featuredRate, creator.currency)}.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                      Rate from
                    </span>
                    <span className="text-xs font-bold font-mono text-[var(--color-text-primary)]">
                      {formatCurrency(creator.featuredRate, creator.currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onNavigate(`/creator/${creator.username}`)} className="text-xs">
                      <span>Kit</span>
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setInviteModalCreator(creator)} className="text-xs">
                      <Send className="w-3.5 h-3.5 mr-1" />
                      <span>Invite</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invite to Campaign Modal */}
        {inviteModalCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-left space-y-4">
              {inviteSent ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Invitation Dispatched!</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Invitation sent to @{inviteModalCreator.username} for your selected campaign.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <h3 className="text-base font-bold text-white">
                    Invite {inviteModalCreator.fullName} to Collaborate
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Select Campaign</label>
                    <select className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white">
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} — Budget: {formatCurrency(c.budget, c.currency)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Proposed Compensation (USD)</label>
                    <input
                      type="number"
                      defaultValue={inviteModalCreator.featuredRate}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Custom Message / Deliverables Note</label>
                    <textarea
                      rows={3}
                      defaultValue={`Hi ${inviteModalCreator.fullName}! We love your visual aesthetic and would like to invite you to our upcoming campaign. Escrow is fully guaranteed by MAVORA.`}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl p-3 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setInviteModalCreator(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      <Send className="w-3.5 h-3.5 mr-1" />
                      <span>Send Collaboration Offer</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
