import React from 'react';
import { Eye, Edit3, MapPin, Globe, Instagram, Youtube, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { DbProfile, DbSocialAccount, CreatorCategory } from '../../types';
import { Button } from '../ui/Button';

interface PublicProfileCardProps {
  profile: DbProfile | null;
  socials?: DbSocialAccount[];
  onNavigate: (path: string) => void;
}

export const PublicProfileCard: React.FC<PublicProfileCardProps> = ({
  profile,
  socials = [],
  onNavigate,
}) => {
  const displayName = profile?.full_name || 'Creator Name';
  const displayUsername = profile?.username || 'username';
  const avatarUrl = profile?.avatar_url;
  const categories = profile?.categories || (profile?.category ? [profile.category] : ['Fashion']);
  const bio = profile?.bio || 'No biography written yet. Introduce your aesthetic and creative mediums.';
  const location = profile?.location || 'Global';
  const isPublic = profile?.is_public ?? true;

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-7 text-left space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(20,20,22,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#141416]">
              Your Public Creator Presence
            </span>
            <span className="text-xs text-[#888894]">·</span>
            {isPublic ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3 text-amber-600" />
                Private
              </span>
            )}
          </div>
          <p className="text-xs text-[#575762] mt-0.5">
            This card represents how brands, agencies, and the public view your presence on Kollavo.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(`/creator/${displayUsername}`)}
            className="text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-[#8EA633]" />
            <span>View live page</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/profile')}
            className="text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            <span>Edit profile</span>
          </Button>
        </div>
      </div>

      {/* Main Preview Identity Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Avatar + Details */}
        <div className="md:col-span-8 flex items-start sm:items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {initials}
            </div>
          )}

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#141416] truncate">
                {displayName}
              </h3>
              <span className="font-mono text-xs text-[#8EA633] font-semibold">
                @{displayUsername}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#575762]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#888894]" />
                {location}
              </span>
              <span className="text-[#888894]">·</span>
              <span className="font-mono text-[11px] text-[#575762] truncate">
                kollavo.com/creator/{displayUsername}
              </span>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {categories.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-semibold text-[#141416] bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] px-2 py-0.5 rounded-md"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bio Snippet & Socials */}
        <div className="md:col-span-4 bg-[#FAF9F5]/70 rounded-xl p-3.5 border border-[rgba(20,20,22,0.04)] space-y-2">
          <span className="text-[10px] font-bold text-[#888894] uppercase tracking-wider block">
            Editorial Biography
          </span>
          <p className="text-xs text-[#575762] leading-relaxed italic line-clamp-3">
            "{bio}"
          </p>
        </div>
      </div>
    </div>
  );
};
