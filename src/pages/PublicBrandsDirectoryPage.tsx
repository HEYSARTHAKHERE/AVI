import React, { useState } from 'react';
import { Search, Building2, CheckCircle2, ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { kollavoStore, formatCurrency, Brand } from '../data/kollavoStore';
import { useMode } from '../context/ModeContext';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface PublicBrandsDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const PublicBrandsDirectoryPage: React.FC<PublicBrandsDirectoryPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled } = useMode();
  const [searchTerm, setSearchTerm] = useState('');
  const brands = kollavoStore.getBrands(isDemoDataEnabled);

  const filteredBrands = brands.filter(
    (b) =>
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="max-w-3xl mb-10 space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Brand Ecosystem · Commercial Partners
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Brands Partnering on Kollavo
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Discover verified companies, studios, and agencies launching high-production creator campaigns. Explore brand requirements and active collaboration briefs.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm mb-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands by company name, industry, or location..."
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[#38BDF8]/40 transition-all p-6 flex flex-col justify-between shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={brand.logoUrl}
                    alt={brand.companyName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[var(--color-border-subtle)]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold truncate group-hover:text-[#38BDF8] transition-colors">
                        {brand.companyName}
                      </h3>
                      {brand.verifiedStatus === 'Verified' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] block truncate mt-0.5">
                      {brand.industry} · {brand.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                  {brand.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {brand.targetNiches.map((niche) => (
                    <span
                      key={niche}
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                    Active Campaigns
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {brand.activeCampaignsCount} open brief{brand.activeCampaignsCount > 1 ? 's' : ''}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(`/brand/${brand.slug}`)}
                  className="text-xs"
                >
                  <span>Brand Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
