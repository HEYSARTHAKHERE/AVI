import React from 'react';
import { Eye, Edit3, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardHeroProps {
  fullName: string;
  username: string;
  onNavigate: (path: string) => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  fullName,
  username,
  onNavigate,
}) => {
  const firstName = fullName.trim().split(' ')[0] || 'Creator';

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Formatted date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#8EA633]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="space-y-2 relative z-10 text-left">
        <div className="flex items-center gap-2 text-xs text-[#575762]">
          <span className="flex items-center gap-1.5 font-medium text-[#141416]">
            <Calendar className="w-3.5 h-3.5 text-[#8EA633]" />
            {formattedDate}
          </span>
          <span className="text-[#888894]">·</span>
          <span className="font-mono text-[#8EA633] font-semibold">@{username}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141416]">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-xs sm:text-sm text-[#575762] leading-relaxed max-w-xl">
          Here's what's happening with your creator presence and brand collaboration pipeline.
        </p>
      </div>

      {/* Hero CTA Actions */}
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <Button
          variant="outline"
          size="md"
          onClick={() => onNavigate(`/creator/${username}`)}
          className="text-xs"
        >
          <Eye className="w-4 h-4 mr-1.5 text-[#8EA633]" />
          <span>View public profile</span>
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('/profile')}
          className="text-xs"
        >
          <Edit3 className="w-4 h-4 mr-1.5" />
          <span>Edit profile</span>
        </Button>
      </div>
    </div>
  );
};
