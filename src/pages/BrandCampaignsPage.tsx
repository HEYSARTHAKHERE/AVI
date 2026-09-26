import React, { useState } from 'react';
import { Briefcase, Plus, Sparkles, Clock, CheckCircle2, DollarSign, X, Layers, Send } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { kollavoStore, formatCurrency, Campaign } from '../data/kollavoStore';
import { generateCampaignBrief, GeneratedBrief } from '../lib/gemini';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface BrandCampaignsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandCampaignsPage: React.FC<BrandCampaignsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const campaigns = kollavoStore.getCampaigns(isDemoDataEnabled);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form state
  const [productService, setProductService] = useState('Minimalist Merino Wool Overcoat');
  const [objective, setObjective] = useState('Drive Autumn Capsule awareness & high-converting pre-orders');
  const [targetAudience, setTargetAudience] = useState('Design-conscious urban professionals aged 24-38');
  const [platform, setPlatform] = useState('Instagram');
  const [budget, setBudget] = useState(4500);
  const [templateType, setTemplateType] = useState('Influencer Campaign');

  // AI Generated Draft
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedBrief | null>(null);

  const handleGenerateAiBrief = async () => {
    setAiGenerating(true);
    try {
      const draft = await generateCampaignBrief({
        productService,
        objective,
        audience: targetAudience,
        platform,
        budget,
        currency: activeCurrency,
      });
      setGeneratedDraft(draft);
    } catch (err) {
      console.warn('AI brief gen error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    kollavoStore.addCampaign({
      brandId: 'br_01',
      brandName: 'Acme Studio Atelier',
      title: `${productService} Campaign`,
      productService,
      objective: generatedDraft?.objective || objective,
      description: generatedDraft ? `${generatedDraft.objective} Deliverables: ${generatedDraft.deliverables.join(' · ')}` : objective,
      budget,
      currency: activeCurrency,
      platforms: [platform],
      deliverables: generatedDraft?.deliverables || ['1x Reel (4K)', '2x Stories'],
      targetCountries: ['United States', 'United Kingdom', 'Global'],
      targetNiches: ['Fashion', 'Lifestyle'],
      deadline: '2026-11-15',
      status: 'Active',
      templateType,
      usageRights: generatedDraft?.usageRights || '30 days digital ad rights',
    });

    setModalOpen(false);
    setGeneratedDraft(null);
  };

  return (
    <DashboardLayout currentPath="/brand/campaigns" pageTitle="Brand Collaboration Campaigns" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Campaigns & Creative Briefs
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Launch structured collaboration campaigns with transparent deliverables and escrow guarantees.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Create New Campaign</span>
          </Button>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 uppercase">
                      {camp.templateType}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">
                      Deadline: {camp.deadline}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Product: {camp.productService} · Target: {camp.targetNiches.join(', ')}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-emerald-500 block">
                    {formatCurrency(camp.budget, camp.currency)}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {camp.applicantsCount} applicants · {camp.confirmedCreatorsCount} confirmed
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span>Deliverables: {camp.deliverables.join(' · ')}</span>
                <Button variant="outline" size="sm" onClick={() => onNavigate('/brand/applications')} className="text-xs">
                  <span>View Applicants ({camp.applicantsCount})</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Creation & AI Brief Generator Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-2xl rounded-2xl shadow-2xl p-6 text-left max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-bold text-white">Create Campaign with AI Brief Assistant</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePublishCampaign} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#94A3B8] mb-1">Product or Service</label>
                    <input
                      type="text"
                      value={productService}
                      onChange={(e) => setProductService(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#94A3B8] mb-1">Campaign Template</label>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="Influencer Campaign">Influencer Campaign</option>
                      <option value="UGC Campaign">UGC Video Ad Campaign</option>
                      <option value="Product Launch">Product Launch Feature</option>
                      <option value="Event Campaign">Event Coverage & Attendance</option>
                      <option value="Long-term Ambassador">Brand Ambassador Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#94A3B8] mb-1">Primary Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="Instagram">Instagram (Reels + Stories)</option>
                      <option value="TikTok">TikTok (9:16 Video)</option>
                      <option value="YouTube">YouTube (Integration / Dedicated)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#94A3B8] mb-1">Total Creator Budget ({activeCurrency})</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Primary Campaign Objective</label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Target Audience Profile</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                {/* AI Brief Generator Trigger */}
                <div className="p-3 rounded-xl bg-[#111B2E] border border-[#38BDF8]/20 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Generate Structured Creative Brief</span>
                    <p className="text-[11px] text-[#94A3B8]">
                      Gemini will craft deliverable specs, timeline, CTA, and usage rights.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAiBrief}
                    disabled={aiGenerating}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-[#38BDF8]" />
                    <span>{aiGenerating ? 'Generating...' : 'Run Gemini Architect'}</span>
                  </Button>
                </div>

                {/* Generated Brief Review Box */}
                {generatedDraft && (
                  <div className="p-4 rounded-xl bg-[#050814] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-emerald-400">
                        AI Structured Brief Draft (Review & Approve)
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Review before publishing</span>
                    </div>

                    <p className="text-[#F8FAFC]"><strong>Objective:</strong> {generatedDraft.objective}</p>
                    <p className="text-[#F8FAFC]"><strong>Deliverables:</strong> {generatedDraft.deliverables.join(' · ')}</p>
                    <p className="text-[#F8FAFC]"><strong>Timeline:</strong> {generatedDraft.timeline}</p>
                    <p className="text-[#F8FAFC]"><strong>Usage Rights:</strong> {generatedDraft.usageRights}</p>
                    <p className="text-[#F8FAFC]"><strong>Approval:</strong> {generatedDraft.approvalProcess}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    <span>Publish Campaign to Board</span>
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
