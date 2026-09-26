import React, { useState } from 'react';
import { Briefcase, Plus, Sparkles, Filter, Check, X } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';

interface CollaborationsPageProps {
  onNavigate: (path: string) => void;
}

export const CollaborationsPage: React.FC<CollaborationsPageProps> = ({ onNavigate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const pipelineStages = [
    { name: 'Inquiries', count: 0 },
    { name: 'Negotiation', count: 0 },
    { name: 'Confirmed', count: 0 },
    { name: 'In Progress', count: 0 },
    { name: 'Completed', count: 0 },
  ];

  return (
    <DashboardLayout
      currentPath="/collaborations"
      pageTitle="Collaboration Pipeline"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
              Collaboration Pipeline & Deals
            </h2>
            <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
              Organize inbound brand briefs, contract terms, deliverables, and payment deadlines.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add collaboration</span>
          </Button>
        </div>

        {/* Pipeline Stage Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-xl border border-[rgba(20,20,22,0.06)] overflow-x-auto">
          {pipelineStages.map((stage, idx) => (
            <button
              key={stage.name}
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                idx === 0
                  ? 'bg-[#141416] text-[#FAF9F5]'
                  : 'text-[#575762] hover:text-[#141416] hover:bg-[#FAF9F5]'
              }`}
            >
              <span>{stage.name}</span>
              <span className="font-mono text-[10px] opacity-75">({stage.count})</span>
            </button>
          ))}
        </div>

        {/* Polished Empty State */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.08)] text-[#8EA633] flex items-center justify-center mx-auto shadow-2xs">
            <Briefcase className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-[#141416]">
              Keep every collaboration organized.
            </h3>
            <p className="text-xs sm:text-sm text-[#575762] leading-relaxed max-w-md mx-auto">
              Your deal tracker is active. When brands submit an inquiry on your public profile or when you close an inbound sponsorship, you can track deliverables and contracts here.
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
              <span>Add collaboration</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/dashboard')}
              className="text-xs"
            >
              <span>View dashboard</span>
            </Button>
          </div>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8EA633]" />
            <span>Phase 4 Workspace Active · Comprehensive Kanban deal manager will expand in a future phase.</span>
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
                Collaboration Pipeline
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888894] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#141416]">
              Collaboration Tracker
            </h3>
            <p className="text-xs text-[#575762] leading-relaxed">
              In Phase 4, the collaboration architecture and database schemas are established. The full Kanban pipeline with contract attachments and delivery calendars is scheduled for a future milestone.
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
