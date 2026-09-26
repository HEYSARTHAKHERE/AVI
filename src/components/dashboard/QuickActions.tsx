import React from 'react';
import { UserCheck, ImagePlus, FileText, Handshake, ArrowUpRight } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Refine your bio, location, categories, and custom rates',
      target: '/profile',
      icon: UserCheck,
      badge: 'Foundation',
    },
    {
      id: 'portfolio',
      title: 'Add Portfolio',
      description: 'Upload high-resolution editorial campaigns and lookbooks',
      target: '/portfolio',
      icon: ImagePlus,
      badge: 'Visuals',
    },
    {
      id: 'mediakit',
      title: 'Create Media Kit',
      description: 'Assemble commercial rate cards and reach stats for brands',
      target: '/media-kit',
      icon: FileText,
      badge: 'Brand Kit',
    },
    {
      id: 'collaborations',
      title: 'Add Collaboration',
      description: 'Log pending inquiries, active deliverables, and contracts',
      target: '/collaborations',
      icon: Handshake,
      badge: 'Deals',
    },
  ];

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#141416]">
          Quick Actions
        </h2>
        <span className="text-xs text-[#888894]">One-click workspace shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onNavigate(act.target)}
              className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(20,20,22,0.08)] shadow-sm text-left flex flex-col justify-between min-h-[140px] hover:border-[#8EA633] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] flex items-center justify-center text-[#575762] group-hover:text-[#141416] group-hover:bg-[#8EA633]/15 transition-colors">
                  <Icon className="w-5 h-5 text-[#141416]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#888894] uppercase tracking-wider">
                    {act.badge}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#888894] group-hover:text-[#8EA633] transition-colors" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-sm font-bold text-[#141416] block group-hover:text-[#8EA633] transition-colors">
                  {act.title}
                </span>
                <p className="text-xs text-[#575762] leading-relaxed mt-1 line-clamp-2">
                  {act.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
