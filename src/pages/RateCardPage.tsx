import React, { useState } from 'react';
import { DollarSign, Plus, Check, Trash2, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../data/kollavoStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface RateCardPageProps {
  onNavigate: (path: string) => void;
}

export const RateCardPage: React.FC<RateCardPageProps> = ({ onNavigate }) => {
  const { activeCurrency } = useMode();
  const [rates, setRates] = useState([
    { id: '1', service: 'Instagram Reel (Editorial 4K Cut)', rate: 1200, turnaround: '5 days', isPublic: true },
    { id: '2', service: 'Instagram Story Frame Sequence (3 Frames)', rate: 450, turnaround: '2 days', isPublic: true },
    { id: '3', service: 'Dedicated Lookbook Photo Series (8 High-Res)', rate: 1500, turnaround: '7 days', isPublic: true },
    { id: '4', service: 'Full UGC Video Package (3 Concept Videos + Hooks)', rate: 2200, turnaround: '10 days', isPublic: true },
    { id: '5', service: 'YouTube Dedicated Review (8-10 Minutes)', rate: 2500, turnaround: '14 days', isPublic: true },
    { id: '6', service: '30-Day Digital Ad Usage Rights Add-on', rate: 500, turnaround: 'Immediate', isPublic: true },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateRate = (id: string, newRate: number) => {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, rate: newRate } : r)));
  };

  const handleTogglePublic = (id: string) => {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, isPublic: !r.isPublic } : r)));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <DashboardLayout currentPath="/rate-card" pageTitle="Commercial Rate Card" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Commercial Rate Card & Services
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Define your deliverable prices. Control whether rates appear publicly on your media kit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Rates Updated
              </span>
            )}
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Rate Card
            </Button>
          </div>
        </div>

        {/* Rate Items Table */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
          <div className="space-y-3">
            {rates.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                    {item.service}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Standard delivery: {item.turnaround}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold">{activeCurrency}</span>
                    <input
                      type="number"
                      step="50"
                      value={item.rate}
                      onChange={(e) => handleUpdateRate(item.id, Number(e.target.value))}
                      className="w-24 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[var(--color-text-primary)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublic(item.id)}
                    className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                      item.isPublic
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-white/5 text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]'
                    }`}
                  >
                    {item.isPublic ? 'Public on Media Kit' : 'Private Quote Only'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
