import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PricingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenAuth }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const proPrice = billingCycle === 'annual' ? 15 : 19;
  const brandPrice = billingCycle === 'annual' ? 69 : 89;

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#575762] mb-3 flex items-center justify-center gap-2">
            <span>Transparent Plans</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8EA633]">Creator First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141416] [text-wrap:balance]">
            Simple, honest pricing for every stage of your career.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#575762] leading-relaxed">
            Start for free, then upgrade as your brand deal volume and creative team grow.
          </p>

          {/* Billing Cycle Segmented Control - Functional Buttons */}
          <div className="mt-8 inline-flex items-center p-1 bg-[#F3F1EC] rounded-xl border border-[rgba(20,20,22,0.06)]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#FFFFFF] text-[#141416] shadow-xs font-semibold'
                  : 'text-[#575762] hover:text-[#141416]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#FFFFFF] text-[#141416] shadow-xs font-semibold'
                  : 'text-[#575762] hover:text-[#141416]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold text-[#3D4A14] bg-[#8EA633]/20 px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Plan 1: Free */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.16)] transition-all">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#888894] mb-2">
                Starter
              </div>
              <h3 className="text-2xl font-bold text-[#141416]">Free</h3>
              <p className="mt-2 text-xs text-[#575762] leading-relaxed">
                Essential presence for emerging creators launching their first media kit.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono-data text-[#141416]">$0</span>
                <span className="text-xs text-[#575762]">/forever</span>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(20,20,22,0.06)] space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Public creator profile (/creator/[handle])</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Up to 6 portfolio items</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Standard media kit with live stats</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Basic contact inquiry form</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => onOpenAuth('signup')}
              >
                Get started free
              </Button>
            </div>
          </div>

          {/* Plan 2: Pro (Elevated / Primary) */}
          <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#141416] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#141416] text-[#FAF9F5] text-[11px] font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full">
              Recommended for Working Creators
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8EA633] mb-2">
                Full OS
              </div>
              <h3 className="text-2xl font-bold text-[#141416]">Pro Creator</h3>
              <p className="mt-2 text-xs text-[#575762] leading-relaxed">
                For active creators and influencers managing steady brand partnerships.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono-data text-[#141416]">${proPrice}</span>
                <span className="text-xs text-[#575762]">
                  /month {billingCycle === 'annual' && 'billed annually'}
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(20,20,22,0.06)] space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#141416] font-medium">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Everything in Free, plus:</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Unlimited portfolio projects & high-res assets</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Dynamic media kit with custom branding & PDF export</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Full Collaboration Manager (Kanban & Table pipeline)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Audience analytics & media-kit download tracking</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Custom domain / priority slug verification</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onOpenAuth('signup')}
              >
                Start 14-day Pro trial
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Plan 3: Brand & Agency */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-8 flex flex-col justify-between hover:border-[rgba(20,20,22,0.16)] transition-all">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#888894] mb-2">
                Agencies & Brands
              </div>
              <h3 className="text-2xl font-bold text-[#141416]">Brand Suite</h3>
              <p className="mt-2 text-xs text-[#575762] leading-relaxed">
                For brands and agencies looking to discover, shortlist, and manage creator rosters.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono-data text-[#141416]">${brandPrice}</span>
                <span className="text-xs text-[#575762]">
                  /month {billingCycle === 'annual' && 'billed annually'}
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(20,20,22,0.06)] space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Direct talent search & verified creator directory</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Send direct campaign briefs & inquiries</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Multi-creator campaign pipeline management</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#575762]">
                  <Check className="w-4 h-4 text-[#8EA633] shrink-0 mt-0.5" />
                  <span>Agency team permissions & shared rosters</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => onOpenAuth('signup')}
              >
                Join Brand Waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
