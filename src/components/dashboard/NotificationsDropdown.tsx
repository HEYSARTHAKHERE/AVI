import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, ExternalLink, Sparkles, AlertCircle, Info, X } from 'lucide-react';
import { DbNotification } from '../../types';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../lib/supabase/client';

interface NotificationsDropdownProps {
  userId?: string;
  onNavigate: (path: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  userId = 'default_user',
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await fetchNotifications(userId);
    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleItemClick = async (notif: DbNotification) => {
    if (!notif.is_read) {
      await markNotificationAsRead(userId, notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    }
    if (notif.link) {
      setIsOpen(false);
      onNavigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#575762] hover:text-[#141416] hover:bg-[rgba(20,20,22,0.04)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633]"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8EA633] ring-2 ring-white"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-2xl overflow-hidden z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[rgba(20,20,22,0.06)] flex items-center justify-between bg-[#FAF9F5]/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141416]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-[#8EA633]/20 text-[#3D4A14] px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-[#575762] hover:text-[#141416] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(20,20,22,0.04)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] text-[#8EA633] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-[#141416]">You're all caught up.</p>
                <p className="text-[11px] text-[#888894]">No new system alerts or notifications.</p>
              </div>
            ) : (
              notifications.map((n) => {
                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      !n.is_read
                        ? 'bg-[#8EA633]/5 hover:bg-[#8EA633]/10'
                        : 'hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'welcome'
                          ? 'bg-[#8EA633]/20 text-[#3D4A14]'
                          : n.type === 'profile_incomplete'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#F3F1EC] text-[#575762]'
                      }`}
                    >
                      {n.type === 'welcome' ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : n.type === 'profile_incomplete' ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#141416] truncate">
                          {n.title}
                        </span>
                        {!n.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8EA633] shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#575762] leading-relaxed mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.06)] text-center text-[10px] text-[#888894]">
            System notifications & updates
          </div>
        </div>
      )}
    </div>
  );
};
