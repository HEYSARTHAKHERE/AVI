import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#141416] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#888894]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] ${
              leftIcon ? 'pl-10' : ''
            } ${rightElement ? 'pr-12' : ''} ${
              error
                ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
                : 'border-[rgba(20,20,22,0.12)] hover:border-[rgba(20,20,22,0.24)]'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#575762]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
