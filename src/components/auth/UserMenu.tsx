import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, ChevronDown, CheckCircle2, User } from 'lucide-react';

interface UserMenuProps {
  onNavigate: (path: string) => void;
  isMobileDrawer?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate, isMobileDrawer = false }) => {
  const { user, profile, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user && !profile) return null;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Creator';
  const displayUsername = profile?.username || user?.user_metadata?.username || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
    setIsOpen(false);
    await logOut();
    onNavigate('/');
  };

  if (isMobileDrawer) {
    return (
      <div className="pt-4 border-t border-[rgba(20,20,22,0.08)] space-y-3">
        <div className="flex items-center gap-3 px-2 py-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-[rgba(20,20,22,0.1)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-[#141416] block truncate">
              {displayName}
            </span>
            <span className="text-xs text-[#575762] block truncate">
              @{displayUsername}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="w-full text-left text-sm font-medium text-[#141416] py-2.5 px-3 rounded-xl hover:bg-[#F3F1EC] transition-colors flex items-center gap-2.5"
        >
          <LayoutDashboard className="w-4 h-4 text-[#8EA633]" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left text-sm font-medium text-red-600 py-2.5 px-3 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-[#F3F1EC] transition-colors border border-[rgba(20,20,22,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633]"
        aria-expanded={isOpen}
        aria-label="User account menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-[rgba(20,20,22,0.1)]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-semibold text-[#141416] max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#888894]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[rgba(20,20,22,0.08)] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-[rgba(20,20,22,0.06)]">
            <span className="text-xs font-bold text-[#141416] block truncate">
              {displayName}
            </span>
            <span className="text-[11px] text-[#575762] block truncate">
              @{displayUsername}
            </span>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate('/dashboard');
              }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-[#141416] hover:bg-[#FAF9F5] transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#8EA633]" />
              <span>Go to Dashboard</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate(`/creator/${displayUsername}`);
              }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-[#141416] hover:bg-[#FAF9F5] transition-colors flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-[#575762]" />
              <span>Public Profile</span>
            </button>
          </div>

          <div className="pt-1 border-t border-[rgba(20,20,22,0.06)]">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
