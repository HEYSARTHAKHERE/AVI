import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { GlobalSearchModal } from './GlobalSearchModal';
import { GoogleWorkspaceModal } from '../workspace/GoogleWorkspaceModal';
import { MAVORAAiModal } from '../ai/MAVORAAiModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  pageTitle: string;
  onNavigate: (path: string) => void;
}

const SIDEBAR_STATE_KEY = 'mavora_sidebar_collapsed';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  pageTitle,
  onNavigate,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141416] flex flex-col">
      {/* Collapsible / Drawer Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenAi={() => setAiOpen(true)}
        onOpenWorkspace={() => setWorkspaceOpen(true)}
      />

      {/* Main Content Area (offset by desktop sidebar width) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Sticky Header */}
        <DashboardHeader
          pageTitle={pageTitle}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onNavigate={onNavigate}
          onOpenWorkspace={() => setWorkspaceOpen(true)}
          onOpenAi={() => setAiOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>

        {/* Quiet Dashboard Footer */}
        <footer className="py-4 px-6 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
          MAVORA Creator Operating System · Phase 4 Workspace
        </footer>
      </div>

      {/* Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Google Workspace Suite Modal */}
      <GoogleWorkspaceModal
        isOpen={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
      />

      {/* MAVORA AI Assistant Modal */}
      <MAVORAAiModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
};
