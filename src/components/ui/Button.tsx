import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0 select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[42px] rounded-xl gap-2',
    lg: 'text-base px-5 py-2.5 min-h-[48px] rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[var(--color-accent)] text-[#10200A] hover:bg-[var(--color-accent-hover)] active:scale-[0.99] shadow-sm',
    secondary:
      'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)] active:scale-[0.99]',
    outline:
      'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-medium)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-tint)] active:scale-[0.99]',
    ghost:
      'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
    accent:
      'bg-[var(--color-accent-indigo)] text-[#082019] hover:opacity-90 active:scale-[0.99] shadow-sm font-semibold',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
