import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  error,
  helperText,
  showStrengthIndicator = false,
  value,
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || 'password-input';

  const stringVal = typeof value === 'string' ? value : '';
  const lengthValid = stringVal.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(stringVal);

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#141416] mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[#888894]">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl pl-10 pr-11 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
            error
              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
              : 'border-[rgba(20,20,22,0.12)] hover:border-[rgba(20,20,22,0.24)]'
          } ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 p-1 text-[#888894] hover:text-[#141416] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Validation feedback or strength helper */}
      {showStrengthIndicator && stringVal.length > 0 && (
        <div className="mt-1.5 flex items-center gap-2 text-[11px]">
          <span className={lengthValid ? 'text-emerald-700 font-medium' : 'text-[#888894]'}>
            • 8+ chars {lengthValid ? '✓' : ''}
          </span>
          <span className={hasNumberOrSymbol ? 'text-emerald-700 font-medium' : 'text-[#888894]'}>
            • Number or symbol {hasNumberOrSymbol ? '✓' : ''}
          </span>
        </div>
      )}

      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium" role="alert">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#575762]">{helperText}</p>
      ) : null}
    </div>
  );
};
