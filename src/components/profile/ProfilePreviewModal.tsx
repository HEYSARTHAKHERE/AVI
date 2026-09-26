import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { PublicProfileView } from './PublicProfileView';
import { mockCreator } from '../../data/mockCreator';
import { Smartphone, Monitor } from 'lucide-react';

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#141416]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF9F5] w-full max-w-6xl h-[92vh] rounded-2xl border border-[rgba(20,20,22,0.12)] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Control Bar */}
        <div className="bg-[#141416] text-[#FAF9F5] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8EA633]">
              Public Creator Profile Experience
            </span>
            <span className="text-xs text-[#888894]">·</span>
            <span className="text-xs text-[#FAF9F5]/70 font-mono hidden sm:inline">
              /creator/{mockCreator.username}
            </span>
          </div>

          {/* Device viewport toggle */}
          <div className="flex items-center gap-1 bg-[#252529] p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-[#141416] text-white font-medium shadow-xs'
                  : 'text-[#888894] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-[#141416] text-white font-medium shadow-xs'
                  : 'text-[#888894] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile (390px)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-medium px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            Close
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto bg-[#FAF9F5] flex justify-center items-start p-2 sm:p-6">
          {deviceMode === 'desktop' ? (
            <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm overflow-hidden min-h-full">
              <PublicProfileView creator={mockCreator} isModal onClose={onClose} />
            </div>
          ) : (
            <div className="w-[390px] bg-[#FFFFFF] rounded-[40px] border-[8px] border-[#141416] shadow-2xl overflow-y-auto max-h-[80vh] my-auto">
              <div className="h-5 bg-[#141416] w-36 mx-auto rounded-b-xl mb-1"></div>
              <PublicProfileView creator={mockCreator} isModal onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
