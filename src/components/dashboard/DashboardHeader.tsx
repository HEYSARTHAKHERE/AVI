import React from 'react';
import { Menu, Search, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationsDropdown } from './NotificationsDropdown';

interface DashboardHeaderProps {
  pageTitle: string;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onNavigate: (path: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  pageTitle,
  onOpenMobileSidebar,
  onOpenSearch,
  onNavigate,
}) => {
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Creator';
  const displayUsername = profile?.username || user?.user_metadata?.username || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#FAF9F5]/85 backdrop-blur-md border-b border-[rgba(20,20,22,0.06)] px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-[#575762] hover:text-[#141416] hover:bg-white/80 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#141416]">
            {pageTitle}
          </h1>
          {profile?.is_public === false && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              Private Profile
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Search + Notifications + Avatar Profile Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(20,20,22,0.08)] text-[#888894] hover:text-[#141416] text-xs transition-all shadow-2xs group"
          title="Search (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-[#141416]" />
          <span className="hidden sm:inline text-xs text-[#575762]">Search workspace...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-[#FAF9F5] border border-[rgba(20,20,22,0.1)] px-1.5 py-0.5 rounded text-[#888894]">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationsDropdown userId={user?.id} onNavigate={onNavigate} />

        {/* Avatar / Quick Profile Navigation */}
        <button
          type="button"
          onClick={() => onNavigate('/profile')}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/80 transition-colors"
          title={`Signed in as ${displayName}`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover border border-[rgba(20,20,22,0.1)] shadow-2xs"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xs shadow-2xs">
              {initials}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
