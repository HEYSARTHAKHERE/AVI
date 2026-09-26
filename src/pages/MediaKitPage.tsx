import React, { useState } from 'react';
import { FileText, Sparkles, Check, Download, ExternalLink, X } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';

interface MediaKitPageProps {
  onNavigate: (path: string) => void;
}

export const MediaKitPage: React.FC<MediaKitPageProps> = ({ onNavigate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout
      currentPath="/media-kit"
      pageTitle="Media Kit Builder"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
              Automated Media Kit
            </h2>
            <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
              Live statistics, rate cards, and audience demographics bundled into an exportable commercial pitch.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Generate PDF kit</span>
          </Button>
        </div>

        {/* Polished Empty State */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.08)] text-[#8EA633] flex items-center justify-center mx-auto shadow-2xs">
            <FileText className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-[#141416]">
              Your media kit, ready to build.
            </h3>
            <p className="text-xs sm:text-sm text-[#575762] leading-relaxed max-w-md mx-auto">
              A MAVORA media kit transforms your verified follower reach, engagement benchmarks, and commercial service rates into a beautiful 1-page editorial link.
            </p>
          </div>

          {/* Included Components Checklist */}
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] max-w-md mx-auto grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Verified Audience Reach</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Commercial Rate Cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Audience Demographics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Direct Booking Contact</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalOpen(true)}
              className="text-xs"
            >
              <span>Create media kit</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/profile?tab=services')}
              className="text-xs"
            >
              <span>Configure services & rates</span>
            </Button>
          </div>
        </div>

        {/* Informational Card */}
        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8EA633]" />
            <span>Phase 4 Workspace Active · Dynamic Media Kit generator and PDF exporter will launch in a later phase.</span>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-xs font-semibold text-[#141416] hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[rgba(20,20,22,0.1)] shadow-2xl p-6 sm:p-8 max-w-md w-full text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8EA633]">
                Media Kit Feature
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888894] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#141416]">
              Live Media Kit Generator
            </h3>
            <p className="text-xs text-[#575762] leading-relaxed">
              Your services, rates, and public biography entered in Profile Management are already linked to your media kit. The full automated PDF export pipeline is scheduled for a future release.
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
