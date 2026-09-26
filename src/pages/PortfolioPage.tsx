import React, { useState } from 'react';
import { Layers, Plus, Sparkles, Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout
      currentPath="/portfolio"
      pageTitle="Portfolio Archive"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
              Portfolio Campaigns & Editorials
            </h2>
            <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
              Curate high-production imagery, brand collaborations, and lookbooks for your public profile.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add project</span>
          </Button>
        </div>

        {/* Polished Empty State */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.08)] text-[#8EA633] flex items-center justify-center mx-auto shadow-2xs">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-[#141416]">
              Showcase your best work.
            </h3>
            <p className="text-xs sm:text-sm text-[#575762] leading-relaxed max-w-md mx-auto">
              Your portfolio will appear here. Upload high-resolution editorial photography, UGC campaign cuts, and creative direction case studies.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalOpen(true)}
              className="text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add your first project</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/profile')}
              className="text-xs"
            >
              <span>Manage profile first</span>
            </Button>
          </div>
        </div>

        {/* Informational Roadmap Card */}
        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8EA633]" />
            <span>Phase 4 Workspace Active · Comprehensive drag-and-drop portfolio builder is scheduled for Phase 5.</span>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-xs font-semibold text-[#141416] hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Info Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[rgba(20,20,22,0.1)] shadow-2xl p-6 sm:p-8 max-w-md w-full text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8EA633]">
                Portfolio Foundation
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888894] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#141416]">
              Portfolio Builder (Phase 5)
            </h3>
            <p className="text-xs text-[#575762] leading-relaxed">
              In Phase 4, your portfolio foundation and navigation are wired into your dashboard. The multi-asset uploader, campaign tagger, and client proofing system will be unlocked in Phase 5.
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
