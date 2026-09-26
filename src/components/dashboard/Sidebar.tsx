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
  X,
  DollarSign,
  Calendar,
  Bookmark,
  MessageSquare,
  Sparkles,
  Building2,
  Users,
  HardDrive,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMode } from '../../context/ModeContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAi?: () => void;
  onOpenWorkspace?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onOpenAi,
  onOpenWorkspace,
}) => {
  const { user, profile, logOut } = useAuth();
  const { activeMode, setMode, toggleMode } = useMode();

  const isBrand = activeMode === 'brand';
  const displayName = profile?.full_name || user?.user_metadata?.full_name || (isBrand ? 'Acme Atelier' : 'Creator');
  const displayUsername = profile?.username || user?.user_metadata?.username || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Creator Mode Navigation (Prompt Section 5 & 6)
  const creatorNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover Briefs', path: '/campaigns', icon: Briefcase },
    { name: 'Collaborations', path: '/collaborations', icon: Layers },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Earnings', path: '/earnings', icon: DollarSign },
    { name: 'Media Kit', path: '/media-kit', icon: FileText },
    { name: 'Portfolio', path: '/portfolio', icon: Layers },
    { name: 'Rate Card', path: '/rate-card', icon: DollarSign },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Saved Brands', path: '/saved-brands', icon: Bookmark },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Brand Mode Navigation (Prompt Section 5 & 6)
  const brandNavItems = [
    { name: 'Dashboard', path: '/brand-dashboard', icon: LayoutDashboard },
    { name: 'Find Creators', path: '/discover-creators', icon: Users },
    { name: 'Campaigns', path: '/brand/campaigns', icon: Briefcase },
    { name: 'Applications', path: '/brand/applications', icon: Layers },
    { name: 'Collaborations', path: '/collaborations', icon: Briefcase },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Payments & Escrow', path: '/brand/payments', icon: DollarSign },
    { name: 'Creator CRM', path: '/brand/crm', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Company Profile', path: '/brand/profile', icon: Building2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const currentNavItems = isBrand ? brandNavItems : creatorNavItems;

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const handleLogout = async () => {
    await logOut();
    onNavigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-[var(--color-bg-card)] border-r border-[var(--color-border-subtle)] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full text-left overflow-y-auto">
          {/* Brand Logo & Collapse Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border-subtle)] shrink-0">
            {!isCollapsed ? (
              <button
                onClick={() => handleLinkClick(isBrand ? '/brand-dashboard' : '/dashboard')}
                className="flex items-center gap-2.5 font-bold text-base tracking-tight text-[var(--color-text-primary)] hover:opacity-85 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
                <span>MAVORA</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick(isBrand ? '/brand-dashboard' : '/dashboard')}
                className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-[#0E1626] text-[#38BDF8] font-bold text-sm border border-white/10"
                title="MAVORA Home"
              >
                K
              </button>
            )}

            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Pill (Prompt Section 6: Fast and obvious Creator/Brand mode switching) */}
          <div className="p-3 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                toggleMode();
                onNavigate(isBrand ? '/dashboard' : '/brand-dashboard');
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all ${
                isBrand
                  ? 'bg-[#6366F1]/15 border-[#6366F1]/30 text-[#818CF8]'
                  : 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#38BDF8]'
              } ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}
              title="Switch Between Creator & Brand Mode"
            >
              {!isCollapsed ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    <span>{isBrand ? 'Brand Workspace' : 'Creator Workspace'}</span>
                  </div>
                  <ArrowRightLeft className="w-3.5 h-3.5 opacity-70" />
                </>
              ) : (
                <ArrowRightLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick AI & Workspace Launcher Buttons */}
          <div className="px-3 pt-2 space-y-1 shrink-0">
            {onOpenAi && (
              <button
                type="button"
                onClick={onOpenAi}
                className={`w-full flex items-center rounded-xl text-xs font-semibold text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/20 transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-2.5'
                }`}
                title="Ask MAVORA AI Assistant"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Ask MAVORA AI</span>}
              </button>
            )}

            {onOpenWorkspace && (
              <button
                type="button"
                onClick={onOpenWorkspace}
                className={`w-full flex items-center rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 border border-[var(--color-border-subtle)] transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-2.5'
                }`}
                title="Google Workspace OAuth Tools"
              >
                <HardDrive className="w-4 h-4 shrink-0 text-[#38BDF8]" />
                {!isCollapsed && <span>Google Workspace</span>}
              </button>
            )}
          </div>

          {/* Primary Navigation List */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {currentNavItems.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleLinkClick(item.path)}
                  title={isCollapsed ? item.name : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-2.5'
                  } ${
                    isActive
                      ? 'bg-[#38BDF8] text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--color-text-muted)]'}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}

            {/* Admin Panel Direct Link (Prompt Section 5 & 45) */}
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <button
                type="button"
                onClick={() => handleLinkClick('/admin')}
                className={`w-full flex items-center rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors ${
                  isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-2.5'
                }`}
                title="Internal Admin Panel"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Admin Workspace</span>}
              </button>
            </div>
          </nav>

          {/* User Footer Profile */}
          <div className="p-3 border-t border-[var(--color-border-subtle)] shrink-0">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <img
                src={avatarUrl || '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg'}
                alt=""
                className="w-9 h-9 rounded-xl object-cover border border-[var(--color-border-subtle)] shrink-0"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] block truncate">
                    @{displayUsername}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
