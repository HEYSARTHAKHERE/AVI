import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface ClaimUsernameCTAProps {
  onClaimUsername: (username: string) => void;
}

export const ClaimUsernameCTA: React.FC<ClaimUsernameCTAProps> = ({ onClaimUsername }) => {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(val);
    if (val.length >= 3) {
      setIsAvailable(val !== 'admin' && val !== 'root');
    } else {
      setIsAvailable(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length >= 3) {
      onClaimUsername(username);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#141416] text-[#FAF9F5] relative overflow-hidden">
      {/* Subtle green ambient spotlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8EA633]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8EA633] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Claim Your Public Handle</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF9F5] [text-wrap:balance]">
          Your creator career deserves a home.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#888894] max-w-xl mx-auto leading-relaxed">
          Secure your verified vanity link and start packaging your collaborations like a premier creative business.
        </p>

        {/* Claim Input Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 sm:mt-10 max-w-xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#252529] p-2 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center flex-1 px-3 py-2 bg-transparent text-sm">
              <span className="text-[#888894] font-mono select-none">mavora.com/creator/</span>
              <input
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="yourhandle"
                className="bg-transparent text-white font-semibold focus:outline-none ml-1 w-full"
                maxLength={24}
              />
            </div>

            <Button
              variant="accent"
              size="md"
              type="submit"
              disabled={username.length < 3}
              className="sm:w-auto text-xs sm:text-sm font-semibold text-[#141416]"
            >
              Claim Handle
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Validation Feedback */}
          {username.length >= 3 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8EA633]">
              <Check className="w-3.5 h-3.5" />
              <span>mavora.com/creator/{username} is available!</span>
            </div>
          )}
        </form>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#888894]">
          <span>Free to get started</span>
          <span aria-hidden="true">·</span>
          <span>No credit card required</span>
          <span aria-hidden="true">·</span>
          <span>Takes less than 3 minutes</span>
        </div>
      </div>
    </section>
  );
};
