import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Bookmark, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, formatCurrency, CampaignApplication } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface BrandApplicationsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandApplicationsPage: React.FC<BrandApplicationsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const applications = mavoraStore.getApplications(isDemoDataEnabled);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const handleAcceptProposal = (app: CampaignApplication) => {
    setAcceptedId(app.id);
    setTimeout(() => {
      onNavigate('/collaborations');
    }, 1500);
  };

  return (
    <DashboardLayout currentPath="/brand/applications" pageTitle="Creator Proposals & Fit" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Applicant Scoring</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Campaign Proposals & Deliverable Fit
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Review applicant proposals with transparent scoring factors. No black-box algorithms: evaluate niche match %, verified social connections, and rate compatibility.
          </p>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={app.creatorAvatar}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border-subtle)]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{app.creatorName}</h3>
                      <span className="text-[11px] font-mono text-[var(--color-text-muted)]">@{app.creatorUsername}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      Applied to: <strong className="text-[var(--color-text-primary)]">{app.campaignTitle}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                    Requested Rate
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-500">
                    {formatCurrency(app.requestedRate, app.currency)}
                  </span>
                </div>
              </div>

              {/* Proposal Text */}
              <div className="p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] leading-relaxed">
                <span className="font-semibold text-[#38BDF8] block mb-1">Proposal Pitch:</span>
                {app.proposalText}
              </div>

              {/* Transparent Fit Factors Breakdown (Prompt Section 27 & 64) */}
              <div className="p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] space-y-2">
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase font-mono block">
                  Transparent Fit Evaluation:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Niche Synergy</span>
                    <strong className="text-emerald-500 font-mono">{app.fitFactors.nicheMatchPercent}% Match</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Location Match</span>
                    <strong className="text-[var(--color-text-primary)] font-mono">{app.fitFactors.locationMatch ? 'Verified Location' : 'Remote'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Platform Match</span>
                    <strong className="text-[#38BDF8] font-mono">{app.fitFactors.platformMatch ? 'Platform Verified' : 'Standard'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Budget Range</span>
                    <strong className="text-emerald-500 font-mono">{app.fitFactors.budgetCompatible ? 'Within Budget' : 'Negotiable'}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] pt-1">
                  {app.fitFactors.explanation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border-subtle)]">
                <Button variant="outline" size="sm" onClick={() => onNavigate(`/creator/${app.creatorUsername}`)} className="text-xs">
                  <span>Inspect Media Kit</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Shortlist</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcceptProposal(app)}
                    className="text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>{acceptedId === app.id ? 'Agreement Created · Redirecting...' : 'Accept & Fund Escrow'}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
