import React, { useState } from 'react';
import { CreatorCategory } from '../../types';
import { MapPin, Globe, Instagram, Youtube, CheckCircle2, Smartphone, Monitor } from 'lucide-react';

interface ProfilePreviewProps {
  fullName: string;
  username: string;
  categories: CreatorCategory[];
  bio: string;
  location: string;
  avatarUrl: string | null;
  instagram: string;
  youtube: string;
  tiktok: string;
  website: string;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  fullName,
  username,
  categories,
  bio,
  location,
  avatarUrl,
  instagram,
  youtube,
  tiktok,
  website,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const displayName = fullName.trim() || 'Your Name';
  const displayUsername = username.trim().toLowerCase() || 'username';
  const displayBio =
    bio.trim() || 'Your creator biography will appear here once written.';
  const displayLocation = location.trim() || 'City · Country';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hasAnySocial = Boolean(instagram || youtube || tiktok || website);

  return (
    <div className="w-full bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg overflow-hidden text-left transition-all duration-300">
      {/* Top Browser Bar Mockup */}
      <div className="bg-[#FAF9F5]/90 border-b border-[rgba(20,20,22,0.06)] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#141416]/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#141416]/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#141416]/20"></div>
        </div>

        <div className="flex items-center gap-1 px-3 py-0.5 bg-white border border-[rgba(20,20,22,0.06)] rounded-md text-[11px] font-mono text-[#575762] truncate max-w-[200px]">
          <span className="text-[#888894]">mavora.com/creator/</span>
          <span className="font-semibold text-[#141416]">{displayUsername}</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#EBE8E1]/60 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1 rounded text-xs transition-colors ${
              deviceMode === 'desktop'
                ? 'bg-white text-[#141416] shadow-2xs font-semibold'
                : 'text-[#888894] hover:text-[#141416]'
            }`}
            title="Desktop card view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1 rounded text-xs transition-colors ${
              deviceMode === 'mobile'
                ? 'bg-white text-[#141416] shadow-2xs font-semibold'
                : 'text-[#888894] hover:text-[#141416]'
            }`}
            title="Mobile simulated view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Profile Card Body */}
      <div className={`p-6 sm:p-8 space-y-6 ${deviceMode === 'mobile' ? 'max-w-[340px] mx-auto' : ''}`}>
        {/* Header: Avatar + Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-2xl shadow-sm">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#8EA633]" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#141416]">
              {displayName}
            </h3>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#575762]">
              <span className="font-mono text-[#8EA633] font-semibold">@{displayUsername}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#888894]" />
                {displayLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] font-semibold text-[#141416] bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] px-2.5 py-1 rounded-md"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-[#888894] italic">
              Categories will appear here
            </span>
          )}
        </div>

        {/* Biography */}
        <div className="bg-[#FAF9F5]/70 rounded-xl p-4 border border-[rgba(20,20,22,0.04)] text-center">
          <p className="text-xs sm:text-sm text-[#575762] leading-relaxed italic">
            "{displayBio}"
          </p>
        </div>

        {/* Social Presence Links */}
        <div className="pt-2 border-t border-[rgba(20,20,22,0.06)]">
          <span className="text-[10px] uppercase font-bold text-[#888894] block text-center mb-2 tracking-wider">
            Connected Presence
          </span>

          {hasAnySocial ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {instagram && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#141416] bg-white border border-[rgba(20,20,22,0.08)] px-2.5 py-1 rounded-lg">
                  <Instagram className="w-3 h-3 text-[#E1306C]" />
                  <span>@{instagram.replace(/^@/, '')}</span>
                </span>
              )}
              {tiktok && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#141416] bg-white border border-[rgba(20,20,22,0.08)] px-2.5 py-1 rounded-lg">
                  <span className="w-3 h-3 rounded bg-black text-white flex items-center justify-center font-bold text-[8px]">TT</span>
                  <span>@{tiktok.replace(/^@/, '')}</span>
                </span>
              )}
              {youtube && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#141416] bg-white border border-[rgba(20,20,22,0.08)] px-2.5 py-1 rounded-lg">
                  <Youtube className="w-3 h-3 text-[#FF0000]" />
                  <span>YouTube</span>
                </span>
              )}
              {website && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#141416] bg-white border border-[rgba(20,20,22,0.08)] px-2.5 py-1 rounded-lg">
                  <Globe className="w-3 h-3 text-[#575762]" />
                  <span>Site</span>
                </span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-[#888894] text-center">
              No public links added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
