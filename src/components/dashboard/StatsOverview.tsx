import React from 'react';
import { Eye, FileText, Handshake, MessageSquare, TrendingUp, HelpCircle } from 'lucide-react';

interface StatsOverviewProps {
  profileViews?: number;
  mediaKitViews?: number;
  activeCollaborations?: number;
  pendingInquiries?: number;
  onNavigate: (path: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  profileViews = 0,
  mediaKitViews = 0,
  activeCollaborations = 0,
  pendingInquiries = 0,
  onNavigate,
}) => {
  const cards = [
    {
      id: 'profile_views',
      label: 'Profile views',
      value: profileViews,
      icon: Eye,
      trendNote: 'Live public profile page visits',
      target: '/analytics',
    },
    {
      id: 'mediakit_views',
      label: 'Media kit views',
      value: mediaKitViews,
      icon: FileText,
      trendNote: 'Brand views of your rate cards',
      target: '/media-kit',
    },
    {
      id: 'active_collabs',
      label: 'Active collaborations',
      value: activeCollaborations,
      icon: Handshake,
      trendNote: 'Confirmed brand partnerships',
      target: '/collaborations',
    },
    {
      id: 'pending_inquiries',
      label: 'Pending inquiries',
      value: pendingInquiries,
      icon: MessageSquare,
      trendNote: 'Inbound contact brief requests',
      target: '/collaborations',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => onNavigate(card.target)}
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-5 text-left flex flex-col justify-between min-h-[130px] hover:border-[#8EA633] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#575762]">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] flex items-center justify-center text-[#575762] group-hover:text-[#141416] transition-colors">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#141416] tabular-nums">
                  {card.value}
                </span>
                <span className="text-xs font-mono text-[#888894]">total</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[rgba(20,20,22,0.04)] flex items-center justify-between text-[11px] text-[#888894]">
                <span className="truncate">{card.trendNote}</span>
                <span className="text-[#8EA633] font-semibold text-[10px] group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
