import React from 'react';
import { ArrowRight, Check, Users, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { DashboardPreview } from './DashboardPreview';
import { useMode } from '../../context/ModeContext';

interface HeroProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onExploreClick: () => void;
  onNavigate?: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAuth,
  onOpenProfile,
  onExploreClick,
  onNavigate,
}) => {
  const { setMode } = useMode();

  const handleCreatorClick = () => {
    setMode('creator');
    if (onNavigate) {
      onNavigate('/signup');
    } else {
      onOpenAuth('signup');
    }
  };

  const handleBrandClick = () => {
    setMode('brand');
    if (onNavigate) {
      onNavigate('/brand-dashboard');
    } else {
      onOpenAuth('signup');
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background subtle ambiance */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#38BDF8]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Category Kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-5">
          <span>Global Commercial Infrastructure</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#38BDF8]">Regulated Escrow & Verified Analytics</span>
        </div>

        {/* Prompt Section 13 Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] max-w-4xl mx-auto leading-[1.12] [text-wrap:balance]">
          Kollavo — Where creators and brands collaborate.
        </h1>

        {/* Prompt Section 13 Supporting text */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
          Discover creators, launch campaigns, manage collaborations, and measure results — all in one global platform.
        </p>

        {/* Dual CTAs: I'm a Creator / I'm a Brand */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreatorClick}
            className="w-full sm:w-auto px-7 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>I'm a Creator</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleBrandClick}
            className="w-full sm:w-auto px-7 flex items-center justify-center gap-2 border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:border-[#38BDF8]"
          >
            <Building2 className="w-4 h-4 text-[#38BDF8]" />
            <span>I'm a Brand</span>
          </Button>
        </div>

        {/* Trust & Proof Markers */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Official OAuth 2.0 Telemetry</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Milestone Escrow Protection</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Fabricated Metrics</span>
          </div>
        </div>

        {/* Dashboard Preview Simulator with Dual Toggle */}
        <div className="mt-12 sm:mt-16">
          <DashboardPreview onOpenProfile={onOpenProfile} onOpenAuth={() => onOpenAuth('signup')} />
        </div>
      </div>
    </section>
  );
};
