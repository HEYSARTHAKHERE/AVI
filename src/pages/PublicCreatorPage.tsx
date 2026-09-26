import React, { useState, useEffect } from 'react';
import { getPublicCreatorProfile } from '../lib/supabase/client';
import { CreatorProfile } from '../types';
import { PublicProfileView } from '../components/profile/PublicProfileView';
import { Button } from '../components/ui/Button';
import { ArrowLeft, UserX, Lock, Loader2 } from 'lucide-react';

interface PublicCreatorPageProps {
  username: string;
  onNavigate: (path: string) => void;
}

export const PublicCreatorPage: React.FC<PublicCreatorPageProps> = ({
  username,
  onNavigate,
}) => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadCreator() {
      setIsLoading(true);
      const res = await getPublicCreatorProfile(username);
      if (mounted) {
        setProfile(res.profile);
        setIsPrivate(Boolean(res.isPrivate));
        setIsLoading(false);
      }
    }
    loadCreator();
    return () => {
      mounted = false;
    };
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#8EA633] animate-spin" />
          <p className="text-xs text-[#575762]">Loading creator presence...</p>
        </div>
      </div>
    );
  }

  // PRIVATE PROFILE SCREEN
  if (isPrivate) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between text-[#141416]">
        {/* Header */}
        <header className="px-6 py-6 border-b border-[rgba(20,20,22,0.06)] bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('/')}
              className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              MAVORA
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-[#575762] hover:text-[#141416] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </div>
        </header>

        {/* Private Notice Body */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                Private Creator Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                This creator profile isn't public yet.
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#575762] leading-relaxed">
                The creator <strong className="font-mono text-[#141416]">@{username}</strong> has set their presence to private or is currently preparing their commercial media kit.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => onNavigate('/login')}
              >
                Log in as creator
              </Button>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onNavigate('/')}
              >
                Explore MAVORA
              </Button>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
          MAVORA Creator Operating System · Privacy Protected
        </footer>
      </div>
    );
  }

  // 404 NOT FOUND SCREEN
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between text-[#141416]">
        {/* Header */}
        <header className="px-6 py-6 border-b border-[rgba(20,20,22,0.06)] bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('/')}
              className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              MAVORA
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-[#575762] hover:text-[#141416] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </div>
        </header>

        {/* 404 Body */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#F3F1EC] text-[#575762] flex items-center justify-center mx-auto">
              <UserX className="w-8 h-8 text-[#888894]" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                Creator not found.
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#575762] leading-relaxed">
                The creator handle <strong className="font-mono text-[#141416]">@{username}</strong> does not exist or may have been renamed.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onNavigate('/')}
              >
                Explore MAVORA
              </Button>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
          MAVORA Creator Operating System · Profile Directory
        </footer>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Return to platform floating banner */}
      <div className="bg-[#141416] text-[#FAF9F5] px-4 py-2.5 text-xs flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8EA633]"></span>
          <span>
            You are viewing the live public creator page for{' '}
            <strong>@{profile.username}</strong>
          </span>
        </div>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="text-xs font-semibold px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-white"
        >
          ← Back to Dashboard
        </button>
      </div>

      <PublicProfileView creator={profile} />
    </div>
  );
};
