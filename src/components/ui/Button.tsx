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
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633]/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0 select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[42px] rounded-xl gap-2',
    lg: 'text-base px-5 py-2.5 min-h-[48px] rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#141416] text-[#FAF9F5] hover:bg-[#252529] active:scale-[0.99] shadow-sm',
    secondary:
      'bg-[#F3F1EC] text-[#141416] hover:bg-[#EBE8E1] border border-[rgba(20,20,22,0.06)] active:scale-[0.99]',
    outline:
      'bg-transparent text-[#141416] border border-[rgba(20,20,22,0.15)] hover:border-[rgba(20,20,22,0.35)] hover:bg-[#FAF9F5] active:scale-[0.99]',
    ghost:
      'bg-transparent text-[#575762] hover:text-[#141416] hover:bg-[rgba(20,20,22,0.04)]',
    accent:
      'bg-[#8EA633] text-[#FAF9F5] hover:bg-[#7E942B] active:scale-[0.99] shadow-sm font-semibold',
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
