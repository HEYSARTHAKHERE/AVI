import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Globe, Sparkles, ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { mavoraStore, formatCurrency, Creator } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface PublicCreatorsDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const PublicCreatorsDirectoryPage: React.FC<PublicCreatorsDirectoryPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const allCreators = mavoraStore.getCreators(isDemoDataEnabled);

  const categories = ['All', 'Fashion', 'Beauty', 'Technology', 'Lifestyle', 'Photography'];

  const filteredCreators = useMemo(() => {
    return allCreators.filter((c) => {
      const matchSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory || c.categories.includes(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [allCreators, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Creator Directory · Verified Roster
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Verified Creators Worldwide
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Connect directly with verified influencers, visual directors, models, and UGC creators. Every profile features traceable social telemetry and transparent commercial rate cards.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search creators by name, niche, or city..."
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#38BDF8] text-white'
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[#38BDF8]/40 transition-all duration-200 p-6 flex flex-col justify-between shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[var(--color-border-subtle)]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold truncate group-hover:text-[#38BDF8] transition-colors">
                        {creator.fullName}
                      </h3>
                      {creator.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs font-mono text-[var(--color-text-muted)] block truncate">
                      @{creator.username}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-secondary)] block mt-0.5">
                      {creator.category} · {creator.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Social Telemetry Status Pills */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
                  {creator.socials.slice(0, 2).map((s, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
                    >
                      <span>{s.displayName}: </span>
                      <strong className="text-[var(--color-text-primary)]">
                        {s.followers ? (s.followers / 1000).toFixed(1) + 'K' : s.status}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                    Starting from
                  </span>
                  <span className="text-sm font-bold font-mono text-[var(--color-text-primary)]">
                    {formatCurrency(creator.featuredRate, creator.currency)}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(`/creator/${creator.username}`)}
                  className="text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  <span>View Profile & Kit</span>
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
