import React from 'react';
import { brand, brandMark } from '../../config/brand';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export function BrandLogo({ className = '', compact = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={brand.name}>
      <svg viewBox={brandMark.viewBox} className="h-8 w-8 shrink-0" aria-hidden="true">
        <path d={brandMark.path} fill="currentColor" />
      </svg>
      {!compact && <span className="font-display text-xl font-extrabold tracking-[-0.07em]">{brand.name}</span>}
    </span>
  );
}
