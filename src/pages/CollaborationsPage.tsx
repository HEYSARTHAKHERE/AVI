import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Sparkles, 
  Filter, 
  Check, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { kollavoStore, formatCurrency, Collaboration } from '../data/kollavoStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface CollaborationsPageProps {
  onNavigate: (path: string) => void;
}

export const CollaborationsPage: React.FC<CollaborationsPageProps> = ({ onNavigate }) => {
  const { activeMode, isDemoDataEnabled, activeCurrency } = useMode();
  const collabs = kollavoStore.getCollaborations(isDemoDataEnabled);
  const [selectedCollabId, setSelectedCollabId] = useState<string>(collabs[0]?.id || '');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('Cut v2 — Revised Brand Ending Frame');
  const [draftNotes, setDraftNotes] = useState('Adjusted final card to remain on screen for 2.8 seconds with direct link sticker.');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const currentCollab = collabs.find((c) => c.id === selectedCollabId) || collabs[0];

  const handleUploadDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCollab) return;

    kollavoStore.submitDeliverable(
      currentCollab.id,
      draftTitle,
      draftNotes,
      '/src/assets/images/portfolio_fashion_editorial_1790400735693.jpg'
    );

    setUploadModalOpen(false);
    setStatusMessage('Draft Cut v2 uploaded to Content Approval Workspace!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleApproveAsset = () => {
    if (!currentCollab) return;
    kollavoStore.updateCollaborationStep(currentCollab.id, 'Completed');
    setStatusMessage('Deliverables Approved! Escrow funds released to creator account balance.');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleRequestRevision = () => {
    if (!currentCollab) return;
    kollavoStore.updateCollaborationStep(currentCollab.id, 'Revision');
    setStatusMessage('Revision requested. Creator has been notified in messages.');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <DashboardLayout currentPath="/collaborations" pageTitle="Collaboration Pipeline & Approvals" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Collaboration & Content Approval Hub
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Track deliverables, upload draft versions, review timestamped feedback, and release escrow funds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => onNavigate('/messages')}>
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>Deal Chat</span>
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-emerald-400/80 hover:text-emerald-400">
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Deal Card */}
        {currentCollab ? (
          <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 shadow-sm">
            {/* Top Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 uppercase">
                    Stage: {currentCollab.workflowStep}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono">
                    Deadline: {currentCollab.deadline}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-1.5">
                  {currentCollab.campaignTitle}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Brand: <strong className="text-[var(--color-text-primary)]">{currentCollab.brandName}</strong> · Creator: <strong className="text-[var(--color-text-primary)]">{currentCollab.creatorName}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                  Agreed Escrow Compensation
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-500">
                  {formatCurrency(currentCollab.paymentAmount, currentCollab.currency)}
                </span>
                <span className="text-[11px] font-mono text-[#38BDF8] block">
                  Status: {currentCollab.escrowStatus}
                </span>
              </div>
            </div>

            {/* 14-Step Progress Bar Visual */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase font-mono text-[var(--color-text-muted)]">
                Collaboration Lifecycle Milestones
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px] font-mono">
                {[
                  { step: 'Agreement', active: true },
                  { step: 'Creation', active: true },
                  { step: 'Submission', active: true },
                  { step: 'Review', active: currentCollab.workflowStep !== 'Content Creation' },
                  { step: 'Revision', active: currentCollab.workflowStep === 'Revision' },
                  { step: 'Approval', active: currentCollab.workflowStep === 'Approval' || currentCollab.status === 'Completed' },
                  { step: 'Publication', active: currentCollab.status === 'Completed' },
                  { step: 'Escrow Paid', active: currentCollab.escrowStatus === 'Released' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${
                      s.active
                        ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8] font-bold'
                        : 'bg-[var(--color-bg-subtle)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {s.step}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverable Specifications & Agreement Terms */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] block mb-1">
                  Required Deliverables
                </span>
                <p className="text-[var(--color-text-primary)] font-medium leading-relaxed">
                  {currentCollab.deliverables}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] block mb-1">
                  Usage Rights Agreement
                </span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {currentCollab.agreement.usageTerms}
                </p>
              </div>
            </div>

            {/* Content Approval Workspace (Prompt Section 28 & 60) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Content Approval Workspace
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Workflow: Draft → Submitted → Under Review → Revision Requested → Approved → Published
                  </p>
                </div>

                {activeMode === 'creator' && currentCollab.status !== 'Completed' && (
                  <Button variant="primary" size="sm" onClick={() => setUploadModalOpen(true)}>
                    <UploadCloud className="w-3.5 h-3.5 mr-1" />
                    <span>Upload New Draft Version</span>
                  </Button>
                )}
              </div>

              {/* Submissions Version History */}
              <div className="space-y-3">
                {currentCollab.submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">
                            {sub.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
                            {sub.status}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          Submitted {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>

                      <a
                        href={sub.assetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#38BDF8] flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Asset Cut</span>
                      </a>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Creator Notes: {sub.notes}
                    </p>

                    {sub.reviewFeedback && (
                      <div className="p-3 rounded-xl bg-white/5 border border-[var(--color-border-subtle)] text-xs text-[#F8FAFC]">
                        <strong className="text-amber-400 block mb-0.5">Brand Review Feedback:</strong>
                        {sub.reviewFeedback}
                      </div>
                    )}

                    {/* Brand Action Buttons */}
                    {activeMode === 'brand' && currentCollab.status !== 'Completed' && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--color-border-subtle)]">
                        <Button variant="outline" size="sm" onClick={handleRequestRevision} className="text-xs">
                          <span>Request Revision</span>
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleApproveAsset} className="text-xs">
                          <Check className="w-3.5 h-3.5 mr-1" />
                          <span>Approve Asset & Release Escrow</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-subtle)]">
            No active collaborations found. Apply to campaign briefs to get started.
          </div>
        )}

        {/* Upload Deliverable Draft Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-left space-y-4">
              <h3 className="text-base font-bold text-white">Upload Deliverable Asset Draft</h3>
              <form onSubmit={handleUploadDraft} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Version Title</label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Creator Notes / Editing Summary</label>
                  <textarea
                    rows={3}
                    value={draftNotes}
                    onChange={(e) => setDraftNotes(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl p-3 text-white resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    <UploadCloud className="w-3.5 h-3.5 mr-1" />
                    <span>Submit for Review</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
