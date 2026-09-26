import React from 'react';
import { MapPin, FileText } from 'lucide-react';
import { Input } from '../ui/Input';

interface AboutStepProps {
  bio: string;
  location: string;
  onUpdate: (data: { bio: string; location: string }) => void;
  onValidChange: (isValid: boolean) => void;
}

export const AboutStep: React.FC<AboutStepProps> = ({
  bio,
  location,
  onUpdate,
  onValidChange,
}) => {
  const MAX_BIO_LENGTH = 250;

  React.useEffect(() => {
    onValidChange(true);
  }, [onValidChange]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_BIO_LENGTH);
    onUpdate({ bio: val, location });
    // Bio is recommended >= 10 chars, location is optional but helpful
    onValidChange(true);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ bio, location: e.target.value });
    onValidChange(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
          Tell people what you create.
        </h2>
        <p className="mt-2 text-sm text-[#575762] leading-relaxed">
          Brands and collaborators read this first. Keep it focused on your creative tone, medium, and aesthetic.
        </p>
      </div>

      <div className="space-y-4">
        {/* Bio Textarea */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#141416]">
              Creator Biography
            </label>
            <span
              className={`text-xs font-mono ${
                bio.length >= MAX_BIO_LENGTH ? 'text-amber-600 font-bold' : 'text-[#888894]'
              }`}
            >
              {bio.length} / {MAX_BIO_LENGTH}
            </span>
          </div>

          <textarea
            rows={4}
            value={bio}
            onChange={handleBioChange}
            placeholder="Fashion creator and model sharing style, lifestyle and creative work."
            className="w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border border-[rgba(20,20,22,0.12)] text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] resize-none leading-relaxed transition-all"
          />
          <p className="mt-1 text-[11px] text-[#575762]">
            Tip: State your visual specialty, editorial perspective, or key creative mediums.
          </p>
        </div>

        {/* Location Input */}
        <Input
          label="Primary City / Base Location"
          type="text"
          placeholder="e.g. Mumbai · London or Los Angeles, CA"
          value={location}
          onChange={handleLocationChange}
          leftIcon={<MapPin className="w-4 h-4" />}
          helperText="General city or region. Never enter a residential street address."
        />
      </div>
    </div>
  );
};
