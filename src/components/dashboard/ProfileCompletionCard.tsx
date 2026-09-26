import React from 'react';
import { Check, ArrowRight, Sparkles, ChevronRight, User, Image, FileText, Globe, Briefcase } from 'lucide-react';
import { DbProfile } from '../../types';
import { calculateProfileCompletion } from '../../lib/profileCompletion';

interface ProfileCompletionCardProps {
  profile: DbProfile | null;
  socialsCount?: number;
  servicesCount?: number;
  onNavigate: (path: string) => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  profile,
  socialsCount = 0,
  servicesCount = 0,
  onNavigate,
}) => {
  const completion = calculateProfileCompletion(profile, socialsCount, servicesCount);

  // Define checklist items with dynamic status and navigation targets
  const checklist = [
    {
      id: 'basic',
      label: 'Basic identity & username',
      completed: completion.basicInfo,
      target: '/profile?tab=profile',
      actionText: 'Review name',
    },
    {
      id: 'categories',
      label: 'Creator categories',
      completed: completion.categories,
      target: '/profile?tab=profile',
      actionText: 'Select categories',
    },
    {
      id: 'avatar',
      label: 'Profile photo / portrait',
      completed: completion.avatar,
      target: '/profile?tab=profile',
      actionText: 'Upload photo',
    },
    {
      id: 'bio',
      label: 'Creator biography',
      completed: completion.bio,
      target: '/profile?tab=about',
      actionText: 'Write bio',
    },
    {
      id: 'socials',
      label: 'Connected social channels',
      completed: completion.socials,
      target: '/profile?tab=socials',
      actionText: 'Connect links',
    },
    {
      id: 'services',
      label: 'Commercial services & rates',
      completed: servicesCount > 0,
      target: '/profile?tab=services',
      actionText: 'Add services',
    },
  ];

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 text-left space-y-5">
      {/* Header with Circular / Pill Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(20,20,22,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8EA633] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Profile Foundation
            </span>
            <span className="text-xs text-[#888894]">·</span>
            <span className="text-xs text-[#575762]">
              {completedCount} of {checklist.length} items verified
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-[#141416] mt-0.5">
            {completion.score >= 100
              ? 'Your creator profile is 100% complete.'
              : completion.score >= 80
              ? 'Your profile is almost ready for brand partnerships.'
              : 'Complete your profile foundation to start pitching.'}
          </h2>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                className="text-[#EBE8E1]"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                className="text-[#8EA633] transition-all duration-700 ease-out"
                strokeWidth="4"
                strokeDasharray={113.1}
                strokeDashoffset={113.1 - (113.1 * completion.score) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-[#141416]">
              {completion.score}%
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-[#141416] block">
              {completion.score}% Complete
            </span>
            <span className="text-[11px] text-[#888894] block">
              {100 - completion.score}% remaining
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {checklist.map((item) => {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.target)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-150 group cursor-pointer ${
                item.completed
                  ? 'bg-[#FAF9F5]/70 border-[rgba(20,20,22,0.06)] hover:bg-[#FAF9F5]'
                  : 'bg-white border-amber-200/80 hover:border-[#8EA633] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    item.completed
                      ? 'bg-[#8EA633] text-[#141416]'
                      : 'border-2 border-amber-500 text-transparent'
                  }`}
                >
                  {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-xs font-semibold block truncate ${
                      item.completed ? 'text-[#141416]' : 'text-[#141416] font-bold'
                    }`}
                  >
                    {item.label}
                  </span>
                  {!item.completed && (
                    <span className="text-[10px] text-amber-700 font-medium">
                      Action needed · {item.actionText}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  item.completed ? 'text-[#888894]' : 'text-[#8EA633]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
