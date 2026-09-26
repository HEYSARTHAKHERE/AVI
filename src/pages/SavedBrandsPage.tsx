import React, { useState } from 'react';
import { Bookmark, Building2, Plus, Mail, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, Brand } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface SavedBrandsPageProps {
  onNavigate: (path: string) => void;
}

export const SavedBrandsPage: React.FC<SavedBrandsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled } = useMode();
  const brands = mavoraStore.getBrands(isDemoDataEnabled);

  return (
    <DashboardLayout currentPath="/saved-brands" pageTitle="Saved Brands & CRM" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Saved Brands & Outreach CRM
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Keep track of dream brand partners, collaboration contacts, and active pitch discussions.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigate('/brands')}>
            <span>Discover More Brands</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={brand.logoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border-subtle)]" />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{brand.companyName}</h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">{brand.industry}</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {brand.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brand.targetNiches.map((niche) => (
                    <span key={niche} className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]">
                      {niche}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-500 font-semibold">
                  {brand.activeCampaignsCount} Active Brief{brand.activeCampaignsCount > 1 ? 's' : ''}
                </span>

                <Button variant="outline" size="sm" onClick={() => onNavigate(`/brand/${brand.slug}`)}>
                  <span>View Profile</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
