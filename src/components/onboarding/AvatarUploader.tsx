import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Loader2, Sparkles, Check } from 'lucide-react';
import { validateImageFile } from '../../lib/validation';
import { uploadAvatar } from '../../lib/supabase/client';

interface AvatarUploaderProps {
  avatarUrl: string | null;
  fullName: string;
  userId?: string;
  onUpdate: (url: string | null, file?: File | null) => void;
  onValidChange: (isValid: boolean) => void;
}

const PRESET_AVATARS = [
  {
    id: 'sarthak',
    label: 'Editorial Travertine',
    url: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
    descriptor: 'Fashion & Architecture',
  },
  {
    id: 'elena',
    label: 'Studio Natural',
    url: '/src/assets/images/avatar_preset_editorial_female_1790401618705.jpg',
    descriptor: 'Creative Direction',
  },
  {
    id: 'kai',
    label: 'Golden Hour Rim',
    url: '/src/assets/images/avatar_preset_streetwear_male_1790401631980.jpg',
    descriptor: 'Streetwear & Lifestyle',
  },
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  fullName,
  userId = 'temp_user',
  onUpdate,
  onValidChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    onValidChange(true);
  }, [onValidChange]);

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploading(true);

    try {
      const publicUrl = await uploadAvatar(userId, file);
      onUpdate(publicUrl, file);
      setIsUploading(false);
      onValidChange(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try another image.';
      setErrorMessage(msg);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url: string) => {
    onUpdate(url, null);
    onValidChange(true);
  };

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CR';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
            Add your profile photo.
          </h2>
          <span className="text-xs font-semibold text-[#8EA633] bg-[#8EA633]/15 px-2 py-0.5 rounded">
            Recommended
          </span>
        </div>
        <p className="mt-2 text-sm text-[#575762] leading-relaxed">
          High-resolution, editorial portraits help brands recognize your aesthetic instantly.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center min-h-[200px] relative ${
          isDragging
            ? 'border-[#8EA633] bg-[#8EA633]/5'
            : avatarUrl
            ? 'border-[rgba(20,20,22,0.12)] bg-white/70 hover:bg-white'
            : 'border-[rgba(20,20,22,0.15)] bg-white/50 hover:bg-white/90 hover:border-[#8EA633]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile image"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-3 py-4">
            <Loader2 className="w-8 h-8 text-[#8EA633] animate-spin" />
            <span className="text-xs font-semibold text-[#141416]">Optimizing & uploading...</span>
          </div>
        ) : avatarUrl ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={fullName || 'Profile Preview'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#141416]/10 shadow-md"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1.5 -right-1.5 p-1.5 bg-[#141416] text-white rounded-full hover:bg-red-600 transition-colors shadow-xs"
                title="Remove photo"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center">
              <span className="text-xs font-semibold text-[#141416] block">
                Photo selected
              </span>
              <p className="text-[11px] text-[#575762] mt-0.5">
                Click or drag another image to replace
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            {/* Fallback Initials Avatar Preview */}
            <div className="w-18 h-18 rounded-2xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-bold text-xl shadow-xs">
              {initials}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#141416]">
              <Upload className="w-4 h-4 text-[#8EA633]" />
              <span>Click to upload or drag and drop</span>
            </div>

            <p className="text-[11px] text-[#888894] max-w-xs leading-relaxed">
              JPG, PNG, or WEBP up to 5MB. If you skip, your profile will use your initials.
            </p>
          </div>
        )}
      </div>

      {/* Preset Editorial Avatars Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#141416] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8EA633]" />
            Or select an editorial preset
          </span>
          <span className="text-[11px] text-[#888894]">Curated luxury portraits</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {PRESET_AVATARS.map((preset) => {
            const isSelected = avatarUrl === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-150 relative cursor-pointer ${
                  isSelected
                    ? 'border-[#8EA633] bg-[#8EA633]/10 ring-2 ring-[#8EA633]/40'
                    : 'border-[rgba(20,20,22,0.08)] bg-white/70 hover:bg-white hover:border-[rgba(20,20,22,0.2)]'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-9 h-9 rounded-lg object-cover border border-[rgba(20,20,22,0.1)] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#141416] block truncate">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-[#888894] block truncate">
                    {preset.descriptor}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#8EA633] text-[#141416] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
