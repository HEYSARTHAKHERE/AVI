import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Layers, 
  FileText, 
  Briefcase, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, profile, logOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Creator';
  const displayUsername = profile?.username || user?.user_metadata?.username || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Portfolio', path: '/portfolio', icon: Layers },
    { name: 'Media Kit', path: '/media-kit', icon: FileText },
    { name: 'Collaborations', path: '/collaborations', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const handleLogout = async () => {
    await logOut();
    onNavigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full text-left">
      {/* Top Brand & Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[rgba(20,20,22,0.06)]">
          {!isCollapsed ? (
            <button
              onClick={() => handleLinkClick('/dashboard')}
              className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-[#141416] transition-opacity hover:opacity-85"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              <span>Kollavo</span>
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick('/dashboard')}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-[#141416] text-[#FAF9F5] font-bold text-sm"
              title="Kollavo Dashboard"
            >
              K
            </button>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-[#888894] hover:text-[#141416] hover:bg-[rgba(20,20,22,0.04)] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#888894] hover:text-[#141416] transition-colors"
            aria-label="Close sidebar drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation List */}
        <div className="p-3 space-y-1">
          {mainNavItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleLinkClick(item.path)}
                title={isCollapsed ? item.name : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-150 group relative cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-[#141416] text-[#FAF9F5] shadow-xs'
                    : 'text-[#575762] hover:text-[#141416] hover:bg-white/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#8EA633]' : 'text-[#888894] group-hover:text-[#141416]'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {/* Subtle active indicator dot */}
                {isActive && !isCollapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8EA633]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="h-[1px] bg-[rgba(20,20,22,0.06)]"></div>
        </div>

        {/* Secondary: Settings & View Public Profile */}
        <div className="p-3 space-y-1">
          <button
            type="button"
            onClick={() => handleLinkClick('/settings')}
            title={isCollapsed ? 'Settings' : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'
            } ${
              currentPath === '/settings'
                ? 'bg-[#141416] text-[#FAF9F5]'
                : 'text-[#575762] hover:text-[#141416] hover:bg-white/80'
            }`}
          >
            <Settings className="w-4 h-4 text-[#888894] shrink-0" />
            {!isCollapsed && <span className="truncate">Settings</span>}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick(`/creator/${displayUsername}`)}
            title={isCollapsed ? 'View Public Profile' : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-medium text-[#575762] hover:text-[#141416] hover:bg-white/80 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-[#8EA633] shrink-0" />
            {!isCollapsed && <span className="truncate">View Public Profile</span>}
          </button>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-[rgba(20,20,22,0.06)] bg-white/40">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/70 border border-[rgba(20,20,22,0.04)]">
            <div
              onClick={() => handleLinkClick('/profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-xl object-cover border border-[rgba(20,20,22,0.1)] shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xs shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#141416] block truncate group-hover:text-[#8EA633] transition-colors">
                  {displayName}
                </span>
                <span className="text-[10px] font-mono text-[#888894] block truncate">
                  @{displayUsername}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-[#888894] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-1"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleLinkClick('/profile')}
              className="relative rounded-xl overflow-hidden focus:outline-none"
              title={displayName}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-xl object-cover border border-[rgba(20,20,22,0.1)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xs">
                  {initials}
                </div>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-[#888894] hover:text-red-600 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky / Fixed Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-r border-[rgba(20,20,22,0.06)] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#FAF9F5] shadow-2xl border-r border-[rgba(20,20,22,0.08)] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
