import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  TrendingUp, 
  Download, 
  Sparkles, 
  Eye, 
  Share2,
  Sliders,
  DollarSign,
  Clock,
  Instagram,
  Youtube
} from 'lucide-react';
import { mockCreator, mockCollaborations, mockAnalytics } from '../../data/mockCreator';

interface DashboardPreviewProps {
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onOpenProfile, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'collaborations' | 'mediakit'>('overview');

  return (
    <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.1)] shadow-xl overflow-hidden text-left transition-all duration-300">
      {/* Top App Chrome / Header bar */}
      <div className="bg-[#FAF9F5] px-4 py-3 border-b border-[rgba(20,20,22,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#141416]/15"></div>
            <div className="w-3 h-3 rounded-full bg-[#141416]/15"></div>
            <div className="w-3 h-3 rounded-full bg-[#141416]/15"></div>
          </div>
          <div className="hidden sm:flex items-center ml-3 px-3 py-1 bg-[#FFFFFF] border border-[rgba(20,20,22,0.06)] rounded-lg text-xs font-mono text-[#575762]">
            <span>app.kollavo.com/dashboard</span>
          </div>
        </div>

        {/* Tab switcher inside the preview */}
        <div className="flex items-center gap-1 bg-[#F3F1EC] p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FFFFFF] text-[#141416] shadow-xs font-semibold'
                : 'text-[#575762] hover:text-[#141416]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'collaborations'
                ? 'bg-[#FFFFFF] text-[#141416] shadow-xs font-semibold'
                : 'text-[#575762] hover:text-[#141416]'
            }`}
          >
            Deals Pipeline ({mockCollaborations.length})
          </button>
          <button
            onClick={() => setActiveTab('mediakit')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'mediakit'
                ? 'bg-[#FFFFFF] text-[#141416] shadow-xs font-semibold'
                : 'text-[#575762] hover:text-[#141416]'
            }`}
          >
            Media Kit Card
          </button>
        </div>

        {/* Profile Pill */}
        <div className="hidden sm:flex items-center gap-2">
          <img
            src={mockCreator.avatarUrl}
            alt={mockCreator.fullName}
            className="w-6 h-6 rounded-full object-cover border border-[rgba(20,20,22,0.1)]"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs font-medium text-[#141416]">sarthak</span>
        </div>
      </div>

      {/* Main Inner Content */}
      <div className="p-4 sm:p-6 bg-[#FFFFFF]">
        {/* Top Greeting & Completion Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[rgba(20,20,22,0.06)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
                Good morning, {mockCreator.fullName.split(' ')[0]}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#3D4A14] bg-[#8EA633]/15 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-[#8EA633]" />
                Pro Active
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#575762]">
              Here is your collaboration activity and profile metrics for this week.
            </p>
          </div>

          {/* Profile Completion widget */}
          <div className="bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] rounded-xl p-3 sm:px-4 sm:py-3 flex items-center justify-between sm:justify-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#141416]">Profile Completion</span>
                <span className="font-mono-data text-[#8EA633] font-bold">88%</span>
              </div>
              <div className="w-36 sm:w-44 h-2 bg-[#EBE8E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#8EA633] rounded-full w-[88%] transition-all duration-500"></div>
              </div>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-xs font-semibold text-[#141416] hover:text-[#8EA633] underline transition-colors whitespace-nowrap"
            >
              Preview Public URL
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-200">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Profile Views */}
              <div className="bg-[#FAF9F5] p-3.5 sm:p-4 rounded-xl border border-[rgba(20,20,22,0.06)]">
                <div className="flex items-center justify-between text-xs text-[#575762] mb-1.5">
                  <span>Profile Views</span>
                  <Eye className="w-3.5 h-3.5 text-[#888894]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono-data text-[#141416]">
                    {mockAnalytics.profileViewsMonthly.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 flex items-center">
                    +{mockAnalytics.profileViewsGrowth}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#888894]">vs previous 30 days</p>
              </div>

              {/* Media Kit Views */}
              <div className="bg-[#FAF9F5] p-3.5 sm:p-4 rounded-xl border border-[rgba(20,20,22,0.06)]">
                <div className="flex items-center justify-between text-xs text-[#575762] mb-1.5">
                  <span>Media Kit Views</span>
                  <Download className="w-3.5 h-3.5 text-[#888894]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono-data text-[#141416]">
                    {mockAnalytics.mediaKitDownloads}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 flex items-center">
                    +18%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#888894]">Brand rate card views</p>
              </div>

              {/* Active Collaborations */}
              <div className="bg-[#FAF9F5] p-3.5 sm:p-4 rounded-xl border border-[rgba(20,20,22,0.06)]">
                <div className="flex items-center justify-between text-xs text-[#575762] mb-1.5">
                  <span>Active Deals</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#888894]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono-data text-[#141416]">
                    {mockAnalytics.activeDealsCount}
                  </span>
                  <span className="text-xs text-[#575762]">
                    campaigns in progress
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#888894] font-mono-data">
                  ${mockAnalytics.pipelineValue.toLocaleString()} active value
                </p>
              </div>

              {/* Pending Inquiries */}
              <div className="bg-[#FAF9F5] p-3.5 sm:p-4 rounded-xl border border-[rgba(20,20,22,0.06)]">
                <div className="flex items-center justify-between text-xs text-[#575762] mb-1.5">
                  <span>New Inquiries</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#8EA633]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono-data text-[#141416]">
                    {mockAnalytics.inquiriesCount}
                  </span>
                  <span className="text-xs font-medium text-[#8EA633]">
                    3 unread
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#888894]">From public contact form</p>
              </div>
            </div>

            {/* Middle Grid: Active Collaborations + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Active Collaborations List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#141416]">
                    Active Brand Collaborations
                  </h3>
                  <button
                    onClick={() => setActiveTab('collaborations')}
                    className="text-xs font-medium text-[#575762] hover:text-[#141416] flex items-center gap-1"
                  >
                    View pipeline <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="border border-[rgba(20,20,22,0.06)] rounded-xl overflow-hidden divide-y divide-[rgba(20,20,22,0.04)]">
                  {mockCollaborations.slice(0, 3).map((collab) => (
                    <div
                      key={collab.id}
                      className="p-3.5 sm:p-4 hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F3F1EC] border border-[rgba(20,20,22,0.06)] flex items-center justify-center font-bold text-xs text-[#141416]">
                          {collab.brandName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#141416]">
                              {collab.brandName}
                            </h4>
                            <span className="text-xs text-[#575762]">·</span>
                            <span className="text-xs text-[#575762]">{collab.platform}</span>
                          </div>
                          <p className="text-xs text-[#575762] line-clamp-1">
                            {collab.campaignName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="text-right">
                          <span className="font-semibold font-mono-data text-[#141416]">
                            ${collab.paymentAmount.toLocaleString()}
                          </span>
                          <p className="text-[11px] text-[#888894]">Due {collab.deadline}</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                            collab.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                              : collab.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                              : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                          }`}
                        >
                          {collab.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Recent Activity Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#141416]">
                    Recent Activity
                  </h3>
                  <span className="text-xs text-[#888894]">Live feed</span>
                </div>

                <div className="bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#8EA633] mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#141416] font-medium">
                        Dior Beauty approved contract terms
                      </p>
                      <p className="text-[#888894] text-[11px] mt-0.5">2 hours ago · Collaboration</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#141416]/40 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#141416] font-medium">
                        Media Kit downloaded by Alo Yoga scout
                      </p>
                      <p className="text-[#888894] text-[11px] mt-0.5">5 hours ago · Media Kit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#141416]/40 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#141416] font-medium">
                        Portfolio updated with Acne Studios lookbook
                      </p>
                      <p className="text-[#888894] text-[11px] mt-0.5">Yesterday · Portfolio</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#141416]/40 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#141416] font-medium">
                        Payment settled: $7,500 from Bang & Olufsen
                      </p>
                      <p className="text-[#888894] text-[11px] mt-0.5">3 days ago · Invoice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLABORATIONS PIPELINE (KANBAN) */}
        {activeTab === 'collaborations' && (
          <div className="pt-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#141416]">
                  Brand Collaboration Pipeline
                </h3>
                <p className="text-xs text-[#575762]">
                  Track outreach, deliverables, contract sign-offs, and payouts.
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="text-xs font-medium bg-[#141416] text-white px-3 py-1.5 rounded-lg hover:bg-[#252529] transition-colors"
              >
                + New Deal Record
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-2">
              {/* Inquiry */}
              <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[rgba(20,20,22,0.06)] min-w-[220px]">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#575762]">
                  <span>Inquiry (1)</span>
                  <span className="font-mono-data text-[#141416]">$2,600</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141416]">Aesop</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">Instagram</span>
                  </div>
                  <p className="text-xs text-[#575762] line-clamp-1">Aromatique Room Spray Launch</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[rgba(20,20,22,0.04)]">
                    <span className="font-mono-data font-semibold text-[#141416]">$2,600</span>
                    <span className="text-[#888894]">Oct 02</span>
                  </div>
                </div>
              </div>

              {/* Negotiating */}
              <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[rgba(20,20,22,0.06)] min-w-[220px]">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#575762]">
                  <span>Negotiating (1)</span>
                  <span className="font-mono-data text-[#141416]">$5,800</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141416]">Sony Alpha</span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">YouTube</span>
                  </div>
                  <p className="text-xs text-[#575762] line-clamp-1">A7C II Creator Field Test</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[rgba(20,20,22,0.04)]">
                    <span className="font-mono-data font-semibold text-[#141416]">$5,800</span>
                    <span className="text-[#888894]">Nov 04</span>
                  </div>
                </div>
              </div>

              {/* Confirmed */}
              <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[rgba(20,20,22,0.06)] min-w-[220px]">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#575762]">
                  <span>Confirmed (1)</span>
                  <span className="font-mono-data text-[#141416]">$3,100</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141416]">Reformation</span>
                    <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">TikTok</span>
                  </div>
                  <p className="text-xs text-[#575762] line-clamp-1">Sustainable Linen Summer Capsule</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[rgba(20,20,22,0.04)]">
                    <span className="font-mono-data font-semibold text-[#141416]">$3,100</span>
                    <span className="text-[#888894]">Oct 22</span>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[rgba(20,20,22,0.06)] min-w-[220px]">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#575762]">
                  <span>In Progress (1)</span>
                  <span className="font-mono-data text-[#141416]">$4,200</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141416]">Dior Beauty</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Reel</span>
                  </div>
                  <p className="text-xs text-[#575762] line-clamp-1">Sauvage Elixir Editorial Integration</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[rgba(20,20,22,0.04)]">
                    <span className="font-mono-data font-semibold text-[#141416]">$4,200</span>
                    <span className="text-[#888894]">Oct 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA KIT CARD PREVIEW */}
        {activeTab === 'mediakit' && (
          <div className="pt-6 animate-in fade-in duration-200">
            <div className="max-w-2xl mx-auto bg-[#FAF9F5] border border-[rgba(20,20,22,0.08)] rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(20,20,22,0.06)] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={mockCreator.avatarUrl}
                    alt={mockCreator.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-[rgba(20,20,22,0.1)]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-base font-bold text-[#141416] flex items-center gap-1.5">
                      {mockCreator.fullName}
                      <CheckCircle2 className="w-4 h-4 text-[#8EA633]" />
                    </h4>
                    <p className="text-xs text-[#575762]">
                      @{mockCreator.username} · {mockCreator.category} · {mockCreator.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenProfile}
                  className="text-xs font-medium bg-[#141416] text-[#FAF9F5] px-3.5 py-2 rounded-lg hover:bg-[#252529] transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Full Media Kit
                </button>
              </div>

              {/* Social Stats Strip */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#575762] block mb-1">Total Audience</span>
                  <span className="text-lg font-bold font-mono-data text-[#141416]">475k+</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#575762] block mb-1">Avg Engagement</span>
                  <span className="text-lg font-bold font-mono-data text-[#141416]">5.2%</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#575762] block mb-1">Commercial Rate</span>
                  <span className="text-lg font-bold font-mono-data text-[#141416]">$2.8k+</span>
                </div>
              </div>

              {/* Demographics row */}
              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-[#141416]">Audience Reach:</span>
                  <span>{mockCreator.audienceDemographics.topLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#141416]">Demographics:</span>
                  <span>{mockCreator.audienceDemographics.genderRatio} · {mockCreator.audienceDemographics.ageRange}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
