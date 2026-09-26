import React from 'react';
import { Check, CheckCircle2, ArrowRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { calculateProfileCompletion } from '../../lib/profileCompletion';
import { OnboardingData } from '../../types';

interface OnboardingCompleteProps {
  data: OnboardingData;
  onGoToDashboard: () => void;
  onViewProfile: (username: string) => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  data,
  onGoToDashboard,
  onViewProfile,
}) => {
  const socialsCount = [data.instagram, data.youtube, data.tiktok, data.website].filter(Boolean).length;
  const completion = calculateProfileCompletion(
    {
      full_name: data.fullName,
      username: data.username,
      categories: data.categories,
      bio: data.bio,
      location: data.location,
      avatar_url: data.avatarUrl,
    },
    socialsCount,
    0
  );

  return (
    <div className="py-6 sm:py-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
      {/* Subtle refined animated success badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8EA633]/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#8EA633]" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
          Your creator profile is ready.
        </h2>
        <p className="text-sm sm:text-base text-[#575762] max-w-md mx-auto leading-relaxed">
          Welcome to MAVORA. Your professional creator presence starts here.
        </p>
      </div>

      {/* Completion Metric Card */}
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 text-left space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#141416] block">
              Profile Foundation Status
            </span>
            <span className="text-[11px] text-[#575762]">
              Calculated from verified creator data
            </span>
          </div>
          <span className="text-2xl font-bold font-mono text-[#8EA633]">
            {completion.score}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#EBE8E1] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#8EA633] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completion.score}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[rgba(20,20,22,0.06)]">
          <div className="flex items-center gap-1.5 text-[#141416]">
            <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            <span>Identity & Handle</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#141416]">
            <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            <span>Creator Categories ({data.categories.length})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#141416]">
            {data.avatarUrl ? (
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            ) : (
              <span className="text-[#888894]">○ Initial Avatar</span>
            )}
            <span>Profile Photo</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#141416]">
            {socialsCount > 0 ? (
              <Check className="w-3.5 h-3.5 text-[#8EA633]" />
            ) : (
              <span className="text-[#888894]">○ Social Channels</span>
            )}
            <span>Socials ({socialsCount})</span>
          </div>
        </div>

        <p className="text-[11px] text-[#888894] italic pt-1">
          * Remaining 10% unlocks when you add your first portfolio case study in Phase 5.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => onViewProfile(data.username)}
          className="order-2 sm:order-1"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View my profile
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onGoToDashboard}
          className="order-1 sm:order-2"
        >
          <span>Go to dashboard</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
