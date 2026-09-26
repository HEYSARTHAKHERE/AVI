import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  DollarSign, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet, 
  MessageSquare,
  Eye,
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, formatCurrency, Campaign, Creator } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { MAVORAAiModal } from '../components/ai/MAVORAAiModal';
import { GoogleWorkspaceModal } from '../components/workspace/GoogleWorkspaceModal';

interface BrandDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const BrandDashboardPage: React.FC<BrandDashboardPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const { profile } = useAuth();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  const campaigns = mavoraStore.getCampaigns(isDemoDataEnabled);
  const applications = mavoraStore.getApplications(isDemoDataEnabled);
  const creators = mavoraStore.getCreators(isDemoDataEnabled);

  const totalActiveBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);

  return (
    <DashboardLayout currentPath="/brand-dashboard" pageTitle="Brand Campaign Operations" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Top Hero Banner */}
        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 uppercase">
                  Brand Workspace Mode
                </span>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">
                  Escrow Vault: Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile?.full_name || 'Acme Studio Atelier'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Manage your active creator collaborations, review transparent applicant fit scores, and release milestone escrow payments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAiModalOpen(true)}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#38BDF8]" />
                <span>AI Brief Generator</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setWorkspaceModalOpen(true)}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
                <span>Google Workspace Tools</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/discover-creators')}
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                <span>Find Creators</span>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[var(--color-border-subtle)]">
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Active Campaigns
              </span>
              <span className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
                {campaigns.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Pending Applicants
              </span>
              <span className="text-2xl font-bold font-mono text-[#38BDF8]">
                {applications.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Total Budget in Escrow
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-500">
                {formatCurrency(totalActiveBudget, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                Deliverables Approved
              </span>
              <span className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
                12
              </span>
            </div>
          </div>
        </div>

        {/* Two Columns: Active Campaigns & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaigns List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Active Campaigns ({campaigns.length})
              </h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate('/brand/campaigns')}>
                <span>View All Briefs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[#38BDF8] uppercase font-semibold">
                        {camp.templateType}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary)] mt-1.5">
                        {camp.title}
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {camp.productService} · Target: {camp.targetNiches.join(', ')}
                      </p>
                    </div>

                    <span className="text-sm font-bold font-mono text-emerald-500 shrink-0">
                      {formatCurrency(camp.budget, camp.currency)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                    <span>Applicants: <strong className="text-[var(--color-text-primary)]">{camp.applicantsCount}</strong></span>
                    <span>Deadline: <strong className="text-[var(--color-text-primary)]">{camp.deadline}</strong></span>
                    <Button variant="outline" size="sm" onClick={() => onNavigate('/brand/applications')} className="text-xs">
                      <span>Review Proposals</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Applicant Fit Preview (1 Col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Top Creator Applicants
              </h3>
              <span className="text-xs font-mono text-[#38BDF8]">Transparent Fit</span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img src={app.creatorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border-subtle)]" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">{app.creatorName}</h4>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">@{app.creatorUsername}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-500">
                      {formatCurrency(app.requestedRate, app.currency)}
                    </span>
                  </div>

                  {/* Fit factors */}
                  <div className="p-2.5 rounded-xl bg-[var(--color-bg-subtle)] text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-[var(--color-text-muted)]">Niche Alignment:</span>
                      <strong className="text-[#38BDF8]">{app.fitFactors.nicheMatchPercent}% Match</strong>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] line-clamp-2">
                      {app.fitFactors.explanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => onNavigate('/brand/applications')} className="text-xs">
                      <span>Evaluate Applicant</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAVORA AI Modal */}
        <MAVORAAiModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

        {/* Google Workspace Modal */}
        <GoogleWorkspaceModal isOpen={workspaceModalOpen} onClose={() => setWorkspaceModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
};
