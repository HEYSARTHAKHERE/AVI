import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, FileText, Layers, BarChart3, Settings, ExternalLink, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const username = profile?.username || 'sarthak';

  const items: SearchItem[] = [
    {
      id: 'profile',
      title: 'Creator Profile & Bio',
      category: 'Profile',
      description: 'Edit your identity, avatar, biography, and categories',
      path: '/profile',
      icon: User,
    },
    {
      id: 'public-profile',
      title: `Public Profile (@${username})`,
      category: 'Public Link',
      description: `View your public page at kollavo.com/creator/${username}`,
      path: `/creator/${username}`,
      icon: ExternalLink,
      isExternal: true,
    },
    {
      id: 'services',
      title: 'Commercial Services & Rates',
      category: 'Profile',
      description: 'Manage brand collaboration packages and pricing',
      path: '/profile?tab=services',
      icon: Briefcase,
    },
    {
      id: 'socials',
      title: 'Connected Social Channels',
      category: 'Profile',
      description: 'Instagram, YouTube, TikTok, and website links',
      path: '/profile?tab=socials',
      icon: User,
    },
    {
      id: 'portfolio',
      title: 'Portfolio Archive',
      category: 'Workspace',
      description: 'Showcase visual campaigns, editorials, and lookbooks',
      path: '/portfolio',
      icon: Layers,
    },
    {
      id: 'mediakit',
      title: 'Media Kit Builder',
      category: 'Workspace',
      description: 'Generate live media kit for brand partnerships',
      path: '/media-kit',
      icon: FileText,
    },
    {
      id: 'collaborations',
      title: 'Collaboration Pipeline',
      category: 'Workspace',
      description: 'Track inbound inquiries, brand deals, and contracts',
      path: '/collaborations',
      icon: Briefcase,
    },
    {
      id: 'analytics',
      title: 'Analytics & Reach',
      category: 'Workspace',
      description: 'Profile traffic, media kit views, and audience reach',
      path: '/analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      title: 'Account Settings',
      category: 'Account',
      description: 'Email, password security, session, and export',
      path: '/settings',
      icon: Settings,
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) {
        onNavigate(target.path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-[rgba(20,20,22,0.1)] shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(20,20,22,0.06)] bg-[#FAF9F5]">
          <Search className="w-5 h-5 text-[#888894] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, profile sections, tools... (Esc to close)"
            className="w-full bg-transparent text-sm text-[#141416] placeholder-[#888894] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#888894] hover:text-[#141416] rounded-md transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#888894]">
              No results found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[#141416] text-[#FAF9F5]'
                      : 'hover:bg-[#FAF9F5] text-[#141416]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#252529] text-[#8EA633]'
                          : 'bg-[#F3F1EC] text-[#575762]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold block truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            isSelected ? 'text-[#8EA633]' : 'text-[#888894]'
                          }`}
                        >
                          · {item.category}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block truncate ${
                          isSelected ? 'text-[#A0A0AB]' : 'text-[#575762]'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ml-2 transition-transform ${
                      isSelected
                        ? 'text-[#8EA633] translate-x-0.5'
                        : 'text-transparent'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.06)] flex items-center justify-between text-[11px] text-[#888894]">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-[rgba(20,20,22,0.1)] rounded font-mono text-[10px]">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-[rgba(20,20,22,0.1)] rounded font-mono text-[10px]">
              ↓
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-[rgba(20,20,22,0.1)] rounded font-mono text-[10px]">
              ↵
            </kbd>
          </div>
          <span>Kollavo Quick Search</span>
        </div>
      </div>
    </div>
  );
};
