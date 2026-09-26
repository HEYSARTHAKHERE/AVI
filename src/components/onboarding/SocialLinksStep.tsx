import React, { useState } from 'react';
import { Instagram, Youtube, Globe, Check, AlertCircle } from 'lucide-react';
import { normalizeSocialUrl } from '../../lib/validation';

interface SocialLinksStepProps {
  instagram: string;
  youtube: string;
  tiktok: string;
  website: string;
  onUpdate: (data: { instagram: string; youtube: string; tiktok: string; website: string }) => void;
  onValidChange: (isValid: boolean) => void;
}

export const SocialLinksStep: React.FC<SocialLinksStepProps> = ({
  instagram,
  youtube,
  tiktok,
  website,
  onUpdate,
  onValidChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const hasActiveErrors = Object.keys(errors).length > 0;
    onValidChange(!hasActiveErrors);
  }, [errors, onValidChange]);

  const validateAndChange = (
    field: 'instagram' | 'youtube' | 'tiktok' | 'website',
    val: string
  ) => {
    const updated = { instagram, youtube, tiktok, website, [field]: val };
    onUpdate(updated);

    const check = normalizeSocialUrl(field, val);
    const newErrors = { ...errors };
    if (!check.valid && val.trim().length > 0) {
      newErrors[field] = check.error || 'Invalid link or username';
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);

    // This step is optional, but if inputs are present, they should not have active validation errors
    const hasActiveErrors = Object.keys(newErrors).length > 0;
    onValidChange(!hasActiveErrors);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
            Where can people find your work?
          </h2>
          <span className="text-xs font-semibold text-[#8EA633] bg-[#8EA633]/15 px-2 py-0.5 rounded">
            Optional
          </span>
        </div>
        <p className="mt-2 text-sm text-[#575762] leading-relaxed">
          Connect your channels to auto-verify your audience reach on your media kit. You can always add or adjust these later.
        </p>
      </div>

      <div className="space-y-4">
        {/* Instagram */}
        <div className="text-left">
          <label className="block text-xs font-semibold text-[#141416] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              Instagram Handle or URL
            </span>
            <span className="text-[11px] text-[#888894]">e.g. @sarthakkamdi</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="username or https://instagram.com/..."
              value={instagram}
              onChange={(e) => validateAndChange('instagram', e.target.value)}
              className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
                errors.instagram ? 'border-red-500' : 'border-[rgba(20,20,22,0.12)]'
              }`}
            />
          </div>
          {errors.instagram ? (
            <p className="mt-1 text-xs text-red-600">{errors.instagram}</p>
          ) : instagram && (
            <p className="mt-1 text-xs text-emerald-700">✓ Normalized to instagram.com/{instagram.replace(/^@/, '')}</p>
          )}
        </div>

        {/* TikTok */}
        <div className="text-left">
          <label className="block text-xs font-semibold text-[#141416] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-black text-white flex items-center justify-center font-bold text-[9px]">TT</span>
              TikTok Handle or URL
            </span>
            <span className="text-[11px] text-[#888894]">e.g. @sarthakcreates</span>
          </label>
          <input
            type="text"
            placeholder="@handle or tiktok.com/@..."
            value={tiktok}
            onChange={(e) => validateAndChange('tiktok', e.target.value)}
            className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
              errors.tiktok ? 'border-red-500' : 'border-[rgba(20,20,22,0.12)]'
            }`}
          />
          {errors.tiktok && <p className="mt-1 text-xs text-red-600">{errors.tiktok}</p>}
        </div>

        {/* YouTube */}
        <div className="text-left">
          <label className="block text-xs font-semibold text-[#141416] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
              YouTube Channel or Handle
            </span>
            <span className="text-[11px] text-[#888894]">e.g. @SarthakStudio</span>
          </label>
          <input
            type="text"
            placeholder="@channel or youtube.com/@..."
            value={youtube}
            onChange={(e) => validateAndChange('youtube', e.target.value)}
            className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
              errors.youtube ? 'border-red-500' : 'border-[rgba(20,20,22,0.12)]'
            }`}
          />
          {errors.youtube && <p className="mt-1 text-xs text-red-600">{errors.youtube}</p>}
        </div>

        {/* Website */}
        <div className="text-left">
          <label className="block text-xs font-semibold text-[#141416] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#575762]" />
              Personal Website / Portfolio
            </span>
            <span className="text-[11px] text-[#888894]">e.g. sarthak.design</span>
          </label>
          <input
            type="text"
            placeholder="https://..."
            value={website}
            onChange={(e) => validateAndChange('website', e.target.value)}
            className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
              errors.website ? 'border-red-500' : 'border-[rgba(20,20,22,0.12)]'
            }`}
          />
          {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website}</p>}
        </div>
      </div>
    </div>
  );
};
