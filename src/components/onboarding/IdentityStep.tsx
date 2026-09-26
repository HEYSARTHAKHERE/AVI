import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { User, AtSign, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { checkUsernameAvailability } from '../../lib/supabase/client';

interface IdentityStepProps {
  fullName: string;
  username: string;
  currentUserId?: string;
  onUpdate: (data: { fullName: string; username: string }) => void;
  onValidChange: (isValid: boolean) => void;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
  fullName,
  username,
  currentUserId,
  onUpdate,
  onValidChange,
}) => {
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'invalid' | 'taken'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (!username) {
      setUsernameStatus('invalid');
      setStatusMessage('Username is required.');
      onValidChange(false);
      return;
    }

    const normalized = username.trim().toLowerCase();
    const formatRegex = /^[a-z0-9_.]{3,30}$/;

    if (!formatRegex.test(normalized)) {
      setUsernameStatus('invalid');
      if (normalized.length < 3) {
        setStatusMessage('Minimum 3 characters required');
      } else if (normalized.length > 30) {
        setStatusMessage('Maximum 30 characters allowed');
      } else {
        setStatusMessage('Lowercase letters, numbers, underscores, and periods only');
      }
      onValidChange(false);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(normalized, currentUserId);
      if (res.available) {
        setUsernameStatus('available');
        setStatusMessage(`kollavo.com/creator/${normalized} is available`);
        onValidChange(Boolean(fullName.trim().length >= 2));
      } else {
        setUsernameStatus('taken');
        setStatusMessage(res.error || 'Username already taken');
        onValidChange(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username, fullName, currentUserId, onValidChange]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.toLowerCase().replace(/\s+/g, '');
    onUpdate({ fullName, username: clean });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ fullName: e.target.value, username });
    if (e.target.value.trim().length >= 2 && usernameStatus === 'available') {
      onValidChange(true);
    } else {
      onValidChange(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
          Let's build your creator identity.
        </h2>
        <p className="mt-2 text-sm text-[#575762] leading-relaxed">
          This is how brands and people will recognize you on Kollavo.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Display Name"
          type="text"
          placeholder="e.g. Sarthak Kamdi"
          value={fullName}
          onChange={handleNameChange}
          leftIcon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-[#141416] mb-1.5">
            Claimed Username Handle
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#888894]">
              <AtSign className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="sarthak"
              value={username}
              onChange={handleUsernameChange}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl pl-10 pr-10 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
                usernameStatus === 'taken' || usernameStatus === 'invalid'
                  ? 'border-red-500'
                  : usernameStatus === 'available'
                  ? 'border-emerald-600'
                  : 'border-[rgba(20,20,22,0.12)]'
              }`}
              required
            />
            <div className="absolute right-3.5 flex items-center">
              {usernameStatus === 'checking' && (
                <Loader2 className="w-4 h-4 text-[#8EA633] animate-spin" />
              )}
              {usernameStatus === 'available' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>

          {statusMessage && (
            <p
              className={`mt-1.5 text-xs ${
                usernameStatus === 'available'
                  ? 'text-emerald-700 font-medium'
                  : 'text-red-600'
              }`}
            >
              {statusMessage}
            </p>
          )}
        </div>

        {/* Live URL Pill Box */}
        <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-xl border border-[rgba(20,20,22,0.06)] flex items-center gap-2 text-xs text-[#575762]">
          <LinkIcon className="w-3.5 h-3.5 text-[#8EA633]" />
          <span>Your shareable profile address:</span>
          <span className="font-mono font-semibold text-[#141416]">
            kollavo.com/creator/{username || 'yourname'}
          </span>
        </div>
      </div>
    </div>
  );
};
