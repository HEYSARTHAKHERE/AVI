import React from 'react';
import { ArrowRight, Sparkles, Check, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { DashboardPreview } from './DashboardPreview';

interface HeroProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAuth,
  onOpenProfile,
  onExploreClick,
}) => {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background subtle ambiance */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#8EA633]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Category Kicker - Zero-Pill text metadata with dot */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#575762] mb-5">
          <span>The Operating System for Creators</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#8EA633]">Brand Deal Workflow</span>
        </div>

        {/* Mandatory Headline with balanced wrapping */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141416] max-w-4xl mx-auto leading-[1.12] [text-wrap:balance]">
          Everything your creator career needs, in one place.
        </h1>

        {/* Mandatory Subheadline */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#575762] max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
          Build your professional creator profile, create a media kit, showcase your work, and manage brand collaborations from one simple workspace.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-7"
          >
            Create your profile
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-6"
          >
            Explore Kollavo
          </Button>
        </div>

        {/* Trust & Proof Markers - Unboxed, clean metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#575762]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            <span>Dynamic live rate cards</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            <span>Collab deal tracking</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            <span>Custom public vanity URL</span>
          </div>
        </div>

        {/* HERO VISUAL: Realistic Kollavo Dashboard Preview */}
        <div id="product" className="mt-12 sm:mt-16 relative">
          <div className="relative mx-auto max-w-5xl rounded-2xl p-2 sm:p-3 bg-[#141416]/[0.02] border border-[rgba(20,20,22,0.08)] shadow-2xl">
            <DashboardPreview
              onOpenProfile={onOpenProfile}
              onOpenAuth={() => onOpenAuth('signup')}
            />
          </div>

          {/* Quick interactive hint below preview */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#888894]">
            <span className="w-2 h-2 rounded-full bg-[#8EA633] animate-pulse"></span>
            <span>Interactive product preview — switch tabs above to test Deal Pipeline & Media Kit</span>
          </div>
        </div>
      </div>
    </section>
  );
};
