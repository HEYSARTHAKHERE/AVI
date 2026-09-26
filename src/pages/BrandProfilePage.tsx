import React, { useState } from 'react';
import { Building2, Globe, CheckCircle2, Eye, Check, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore } from '../data/mavoraStore';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

interface BrandProfilePageProps {
  onNavigate: (path: string) => void;
}

export const BrandProfilePage: React.FC<BrandProfilePageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState('Acme Studio Atelier');
  const [industry, setIndustry] = useState('Luxury Fashion & Accessories');
  const [website, setWebsite] = useState('https://acme-atelier.com');
  const [location, setLocation] = useState('London · New York');
  const [description, setDescription] = useState(
    'Bespoke tailoring, artisanal leather goods, and sustainable outerwear designed for modern metropolitan life.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout currentPath="/brand/profile" pageTitle="Brand Company Profile" onNavigate={onNavigate}>
      <div className="space-y-6 text-left max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Company Profile & Brand Identity
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              This information is visible to creators when reviewing your campaign briefs.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigate('/brand/acme-luxury')}>
            <Eye className="w-3.5 h-3.5 mr-1 text-[#38BDF8]" />
            <span>View Public Brand Page</span>
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-border-subtle)]">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80"
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-[var(--color-border-subtle)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[var(--color-text-primary)]">{companyName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-semibold">
                  Verified Business
                </span>
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)]">Slug: /brand/acme-luxury</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--color-text-secondary)] mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-text-secondary)] mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--color-text-secondary)] mb-1">Official Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-text-secondary)] mb-1">HQ Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-text-secondary)] mb-1">Company Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl p-3 text-xs text-[var(--color-text-primary)] resize-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[var(--color-border-subtle)]">
            {saved ? (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated
              </span>
            ) : <span />}

            <Button type="submit" variant="primary" size="sm">
              Save Brand Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
