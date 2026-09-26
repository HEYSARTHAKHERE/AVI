import React, { useState } from 'react';
import { Users, Bookmark, Search, Plus, Mail, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { kollavoStore, Creator, formatCurrency } from '../data/kollavoStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface BrandCrmPageProps {
  onNavigate: (path: string) => void;
}

export const BrandCrmPage: React.FC<BrandCrmPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled } = useMode();
  const creators = kollavoStore.getCreators(isDemoDataEnabled);
  const [activeTab, setActiveTab] = useState<'roster' | 'shortlist' | 'contacts'>('roster');

  return (
    <DashboardLayout currentPath="/brand/crm" pageTitle="Creator CRM & Roster" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Creator CRM & Talent Shortlists
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Organize your preferred creator network, performance notes, tags, and campaign history.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => onNavigate('/discover-creators')}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Discover New Talent</span>
          </Button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              activeTab === 'roster' ? 'bg-[#38BDF8] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            All Saved Talent ({creators.length})
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              activeTab === 'shortlist' ? 'bg-[#38BDF8] text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            Shortlists (3)
          </button>
        </div>

        {/* Creator Roster List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={c.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border-subtle)]" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{c.fullName}</h4>
                      {c.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)]">@{c.username}</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {c.bio}
                </p>

                <div className="p-2.5 rounded-xl bg-[var(--color-bg-subtle)] text-[11px] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#38BDF8] block">CRM Notes:</span>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Reliable 4K delivery · Quick revisions turn · Preferred for AW seasonal lookbooks.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {formatCurrency(c.featuredRate, c.currency)}
                </span>
                <Button variant="outline" size="sm" onClick={() => onNavigate(`/creator/${c.username}`)} className="text-xs">
                  <span>View Kit</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
