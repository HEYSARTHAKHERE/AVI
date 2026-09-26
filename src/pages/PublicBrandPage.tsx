import React from 'react';
import { Building2, CheckCircle2, Globe, ExternalLink, ArrowRight, Briefcase, Mail } from 'lucide-react';
import { kollavoStore, formatCurrency } from '../data/kollavoStore';
import { useMode } from '../context/ModeContext';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface PublicBrandPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PublicBrandPage: React.FC<PublicBrandPageProps> = ({ slug, onNavigate }) => {
  const { isDemoDataEnabled } = useMode();
  const brands = kollavoStore.getBrands(isDemoDataEnabled);
  const brand = brands.find((b) => b.slug === slug) || brands[0];
  const campaigns = kollavoStore.getCampaigns(isDemoDataEnabled).filter((c) => c.brandId === brand.id);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-10">
        {/* Brand Banner Header */}
        <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={brand.logoUrl}
              alt={brand.companyName}
              className="w-20 h-20 rounded-2xl object-cover border border-[var(--color-border-subtle)]"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {brand.companyName}
                </h1>
                {brand.verifiedStatus === 'Verified' && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Partner</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {brand.industry} · {brand.location}
              </p>
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#38BDF8] flex items-center gap-1 hover:underline"
                >
                  <span>{brand.website.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate(`/campaigns`)}
            >
              <span>View Open Briefs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pt-4 border-t border-[var(--color-border-subtle)]">
            {brand.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] mr-1">
              Target Creative Niches:
            </span>
            {brand.targetNiches.map((niche) => (
              <span
                key={niche}
                className="text-xs px-2.5 py-1 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] font-medium"
              >
                {niche}
              </span>
            ))}
          </div>
        </div>

        {/* Brand's Active Campaigns */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Active Collaboration Briefs ({campaigns.length})</h2>
            <span className="text-xs text-[var(--color-text-muted)]">Funded with Kollavo Escrow</span>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center text-[var(--color-text-muted)] text-xs">
              This brand currently has no public briefs accepting proposals.
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-[#38BDF8]">
                      {camp.templateType}
                    </span>
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                      {camp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-base font-bold font-mono text-emerald-500">
                      {formatCurrency(camp.budget, camp.currency)}
                    </span>
                    <Button variant="primary" size="sm" onClick={() => onNavigate('/campaigns')}>
                      <span>Apply</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
