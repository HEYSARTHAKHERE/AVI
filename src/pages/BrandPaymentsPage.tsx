import React, { useState } from 'react';
import { DollarSign, ShieldCheck, ArrowUpRight, Lock, CheckCircle2, Clock } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, formatCurrency } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface BrandPaymentsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandPaymentsPage: React.FC<BrandPaymentsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const collaborations = mavoraStore.getCollaborations(isDemoDataEnabled);
  const ledger = mavoraStore.getLedger(isDemoDataEnabled);

  const totalInEscrow = 2800;
  const totalCompletedPaid = 14200;

  return (
    <DashboardLayout currentPath="/brand/payments" pageTitle="Brand Escrow & Payments" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Escrow Vault & Payments
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Secure milestone escrow funding. Funds are held safely and released upon your deliverable approval.
            </p>
          </div>

          <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Regulated Escrow Active</span>
          </div>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Currently Held in Escrow</span>
            <div className="text-3xl font-extrabold font-mono text-[#38BDF8] tabular-nums">
              {formatCurrency(totalInEscrow, activeCurrency)}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Guaranteed funds locked for in-progress creator deliverables.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Lifetime Payouts Released</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-500 tabular-nums">
              {formatCurrency(totalCompletedPaid, activeCurrency)}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Total campaign funds cleared upon verified deliverable approval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Platform Fee Rate</span>
            <div className="text-3xl font-extrabold font-mono text-[var(--color-text-primary)] tabular-nums">
              5.0%
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Transparent platform fee applied only upon funded campaign deposit.
            </p>
          </div>
        </div>

        {/* Active Escrow Holdings */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Active Escrow Accounts</h3>
          <div className="space-y-3">
            {collaborations.map((collab) => (
              <div
                key={collab.id}
                className="p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      {collab.campaignTitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] font-mono">
                      {collab.escrowStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                    Creator: <strong className="text-[var(--color-text-primary)]">{collab.creatorName}</strong> · Stage: {collab.workflowStep}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold font-mono text-emerald-500">
                    {formatCurrency(collab.paymentAmount, collab.currency)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('/collaborations')} className="text-xs">
                    <span>Manage Deal</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
