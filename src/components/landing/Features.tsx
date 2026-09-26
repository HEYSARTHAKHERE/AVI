import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  Layers, 
  Kanban, 
  BarChart3, 
  Link as LinkIcon, 
  ArrowUpRight,
  Check,
  Instagram,
  Eye,
  DollarSign
} from 'lucide-react';
import { mockCreator } from '../../data/mockCreator';

interface FeaturesProps {
  onOpenProfile: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Features: React.FC<FeaturesProps> = ({ onOpenProfile, onOpenAuth }) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#575762] mb-3 flex items-center gap-2">
            <span>Product Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8EA633]">Core Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141416] [text-wrap:balance]">
            Crafted for creators who treat their work as a business.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#575762] leading-relaxed">
            Replace chaotic spreadsheets, outdated PDF media kits, and scattered Linktree lists with an integrated operating system.
          </p>
        </div>

        {/* 6 Polished Feature Cards in Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Creator Profile (Span 2 on lg for asymmetric hierarchy) */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-[#575762]">
                  <span className="font-semibold text-[#141416]">01. Profile & Presence</span>
                  <span aria-hidden="true">·</span>
                  <span>Public Showcase</span>
                </div>
                <button
                  onClick={onOpenProfile}
                  className="text-xs font-medium text-[#8EA633] group-hover:text-[#7E942B] flex items-center gap-1 transition-colors"
                >
                  Live Preview <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Creator Profile
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#575762] leading-relaxed max-w-xl">
                Create a professional public profile that represents your creator brand. Designed with editorial typography, curated bio, verified badges, and customizable commercial services.
              </p>
            </div>

            {/* Visual Preview Element inside card */}
            <div className="mt-6 pt-6 border-t border-[rgba(20,20,22,0.06)] bg-[#FAF9F5] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={mockCreator.avatarUrl}
                  alt={mockCreator.fullName}
                  className="w-14 h-14 rounded-full object-cover border border-[rgba(20,20,22,0.1)] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-[#141416] flex items-center gap-1.5">
                    {mockCreator.fullName}
                    <span className="text-[11px] font-semibold text-[#3D4A14] bg-[#8EA633]/20 px-1.5 py-0.5 rounded">Verified</span>
                  </h4>
                  <p className="text-xs text-[#575762]">
                    @{mockCreator.username} · {mockCreator.category} · {mockCreator.location}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#888894]">
                    <span>248k Instagram</span>
                    <span aria-hidden="true">·</span>
                    <span>165k TikTok</span>
                    <span aria-hidden="true">·</span>
                    <span>62k YouTube</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenProfile}
                className="text-xs font-semibold px-3 py-1.5 bg-[#FFFFFF] border border-[rgba(20,20,22,0.1)] rounded-lg text-[#141416] hover:bg-[#F3F1EC] transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
              >
                View /creator/{mockCreator.username}
              </button>
            </div>
          </div>

          {/* 2. Media Kit */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200">
            <div>
              <div className="text-xs text-[#575762] mb-4 font-semibold text-[#141416]">
                02. Rate Card
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Media Kit
              </h3>
              <p className="mt-2 text-sm text-[#575762] leading-relaxed">
                Turn creator information and verified statistics into an interactive, real-time media kit that never goes out of date.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)] space-y-2.5">
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.04)] flex items-center justify-between text-xs">
                <span className="text-[#575762]">Commercial Rate Card</span>
                <span className="font-mono-data font-semibold text-[#141416]">From $2,200</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.04)] flex items-center justify-between text-xs">
                <span className="text-[#575762]">Audience Breakdown</span>
                <span className="font-mono-data font-semibold text-[#141416]">74% 21–34 yrs</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.04)] flex items-center justify-between text-xs">
                <span className="text-[#575762]">Live Audience Reach</span>
                <span className="font-mono-data font-semibold text-[#8EA633]">475,000+ Total</span>
              </div>
            </div>
          </div>

          {/* 3. Portfolio */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200">
            <div>
              <div className="text-xs text-[#575762] mb-4 font-semibold text-[#141416]">
                03. Visual Archive
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Portfolio
              </h3>
              <p className="mt-2 text-sm text-[#575762] leading-relaxed">
                Showcase photos, videos, campaigns, and previous work in an editorial masonry grid that highlights your visual taste and deliverables.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)] grid grid-cols-2 gap-2">
              <div className="relative rounded-lg overflow-hidden h-24 bg-[#EBE8E1]">
                <img
                  src={mockCreator.portfolio[0].imageUrl}
                  alt={mockCreator.portfolio[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium">Acne Studios</span>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden h-24 bg-[#EBE8E1]">
                <img
                  src={mockCreator.portfolio[1].imageUrl}
                  alt={mockCreator.portfolio[1].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium">Aesop Campaign</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Collaboration Manager (Span 2 on lg for asymmetric balance) */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#575762]">
                  <span className="font-semibold text-[#141416]">04. Campaign Pipeline</span>
                  <span aria-hidden="true"> · </span>
                  <span>Kanban & Table Views</span>
                </div>
                <span className="text-xs font-mono-data text-[#575762]">Dual View Ready</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Collaboration Manager
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#575762] leading-relaxed max-w-xl">
                Track brand conversations, campaigns, deadlines, deliverables, and payment status. Switch effortlessly between structured table spreadsheets and visual Kanban boards.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)] bg-[#FAF9F5] rounded-xl p-4 overflow-x-auto">
              <div className="grid grid-cols-4 gap-2 text-xs min-w-[420px]">
                <div className="bg-white p-2.5 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-[10px] uppercase font-bold text-[#888894] block">Inquiry</span>
                  <span className="font-semibold text-[#141416] mt-1 block">Aesop</span>
                  <span className="font-mono-data text-[11px] text-[#575762]">$2,600</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-[10px] uppercase font-bold text-[#888894] block">Negotiating</span>
                  <span className="font-semibold text-[#141416] mt-1 block">Sony Alpha</span>
                  <span className="font-mono-data text-[11px] text-[#575762]">$5,800</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[rgba(20,20,22,0.06)]">
                  <span className="text-[10px] uppercase font-bold text-[#888894] block">Confirmed</span>
                  <span className="font-semibold text-[#141416] mt-1 block">Reformation</span>
                  <span className="font-mono-data text-[11px] text-[#575762]">$3,100</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[rgba(20,20,22,0.06)] border-l-2 border-l-[#8EA633]">
                  <span className="text-[10px] uppercase font-bold text-[#8EA633] block">In Progress</span>
                  <span className="font-semibold text-[#141416] mt-1 block">Dior Beauty</span>
                  <span className="font-mono-data text-[11px] text-[#141416] font-bold">$4,200</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Analytics */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200">
            <div>
              <div className="text-xs text-[#575762] mb-4 font-semibold text-[#141416]">
                05. Performance Insights
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Analytics
              </h3>
              <p className="mt-2 text-sm text-[#575762] leading-relaxed">
                Understand profile views, media kit views, and collaboration activity with clear, honest indicators and conversion tracking.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#575762]">Monthly Profile Views</span>
                <span className="font-mono-data font-bold text-[#141416]">18,420 (+28%)</span>
              </div>
              <div className="w-full bg-[#EBE8E1] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8EA633] h-full w-[72%] rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#575762]">Brand Inquiries Converted</span>
                <span className="font-mono-data font-bold text-[#141416]">42.8%</span>
              </div>
            </div>
          </div>

          {/* 6. Shareable Identity */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.18)] transition-all duration-200">
            <div>
              <div className="text-xs text-[#575762] mb-4 font-semibold text-[#141416]">
                06. Custom Vanity URL
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#141416]">
                Shareable Identity
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#575762] leading-relaxed max-w-xl">
                Give every creator a public, branded URL that stands out in bios, email signatures, and agency pitch decks. Complete with Open Graph social preview cards.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[rgba(20,20,22,0.06)] bg-[#FAF9F5] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-mono text-[#141416] bg-[#FFFFFF] border border-[rgba(20,20,22,0.08)] px-3.5 py-2 rounded-lg w-full sm:w-auto">
                <LinkIcon className="w-3.5 h-3.5 text-[#8EA633]" />
                <span>mavora.com/creator/<strong className="text-[#8EA633]">sarthak</strong></span>
              </div>
              <button
                onClick={onOpenProfile}
                className="w-full sm:w-auto px-4 py-2 bg-[#141416] text-[#FAF9F5] text-xs font-medium rounded-lg hover:bg-[#252529] transition-colors whitespace-nowrap"
              >
                Inspect Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
