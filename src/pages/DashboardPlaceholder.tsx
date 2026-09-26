import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { calculateProfileCompletion } from '../lib/profileCompletion';
import { 
  CheckCircle2, 
  LogOut, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft,
  ArrowRight,
  Eye,
  Edit3,
  MapPin,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

interface DashboardPlaceholderProps {
  onNavigate: (path: string) => void;
  currentRoute?: string;
}

export const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({
  onNavigate,
  currentRoute = '/dashboard',
}) => {
  const { user, profile, logOut, isConfigured } = useAuth();

  const handleLogout = async () => {
    await logOut();
    onNavigate('/');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Creator';
  const displayUsername = profile?.username || user?.user_metadata?.username || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const categories = profile?.categories || (profile?.category ? [profile.category] : ['Fashion']);
  const bio = profile?.bio || 'No biography written yet.';
  const location = profile?.location || 'Location not specified';

  // Real calculation from stored profile attributes
  const completion = calculateProfileCompletion(profile, 1, 0);

  const protectedRoutes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Onboarding Flow', path: '/onboarding' },
    { name: 'Profile Editor', path: '/profile' },
    { name: 'Portfolio Archive', path: '/portfolio' },
    { name: 'Media Kit Builder', path: '/media-kit' },
    { name: 'Collaboration Manager', path: '/collaborations' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between text-[#141416]">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[rgba(20,20,22,0.06)] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="text-lg font-bold tracking-tight text-[#141416] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
            Kollavo
          </button>
          <span className="text-xs text-[#888894]">/</span>
          <span className="text-xs font-mono text-[#575762] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[rgba(20,20,22,0.06)]">
            {currentRoute}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-medium text-[#575762] hover:text-[#141416] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing Page</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Log out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Top Greeting & Completion Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8EA633] bg-[#8EA633]/15 px-2 py-0.5 rounded">
                Phase 3 Verified
              </span>
              <span className="text-xs text-[#888894]">·</span>
              <span className="text-xs text-[#575762] font-mono">@{displayUsername}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
              Welcome, {displayName.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-[#575762] leading-relaxed">
              Your creator profile foundation is active and securely stored.
            </p>
          </div>

          {/* Profile Completion Box */}
          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[rgba(20,20,22,0.06)] min-w-[200px] text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#141416]">Profile Completion</span>
              <span className="font-mono text-[#8EA633] font-bold">{completion.score}%</span>
            </div>
            <div className="w-full bg-[#EBE8E1] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#8EA633] h-full rounded-full transition-all duration-500"
                style={{ width: `${completion.score}%` }}
              />
            </div>
            <p className="text-[10px] text-[#888894]">
              {completion.score >= 80 ? 'Foundation complete' : 'Basic info saved'}
            </p>
          </div>
        </div>

        {/* Profile Card Preview */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(20,20,22,0.06)]">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[rgba(20,20,22,0.12)] shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xl shadow-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#141416]">
                    {displayName}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-[#8EA633]" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#575762] mt-0.5">
                  <span className="font-mono font-medium text-[#8EA633]">@{displayUsername}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#888894]" />
                    {location}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate(`/creator/${displayUsername}`)}
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View public profile
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/onboarding')}
                className="text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Continue building profile
              </Button>
            </div>
          </div>

          {/* Categories & Bio */}
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-[#888894] uppercase tracking-wider block mb-2">
                Creator Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-semibold text-[#141416] bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] px-2.5 py-1 rounded-md"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#888894] uppercase tracking-wider block mb-1">
                Biography
              </span>
              <p className="text-xs sm:text-sm text-[#575762] leading-relaxed">
                "{bio}"
              </p>
            </div>
          </div>
        </div>

        {/* Phase 3 Scope Confirmation */}
        <div className="p-4 bg-white/70 backdrop-blur-xs rounded-xl border border-[rgba(20,20,22,0.06)] text-xs text-[#575762] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8EA633]" />
            <span>Row Level Security (RLS) active · Only you can edit this creator profile</span>
          </div>
          <span className="text-[11px] font-mono text-[#888894]">Phase 4 Dashboard next</span>
        </div>

        {/* Test Protected Routes Navigation */}
        <div className="pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#888894] block mb-2.5 text-center">
            Test Protected Routes
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {protectedRoutes.map((r) => (
              <button
                key={r.path}
                onClick={() => onNavigate(r.path)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  currentRoute === r.path
                    ? 'bg-[#141416] text-[#FAF9F5] border-[#141416] font-semibold'
                    : 'bg-white text-[#575762] hover:text-[#141416] border-[rgba(20,20,22,0.06)] hover:bg-[#F3F1EC]'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
        Kollavo Creator Operating System · Phase 3 Onboarding & Profile Foundation
      </footer>
    </div>
  );
};
