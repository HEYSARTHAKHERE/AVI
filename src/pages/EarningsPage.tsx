import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, Download, AlertCircle, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, formatCurrency, FinancialLedgerEntry } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { Button } from '../components/ui/Button';

interface EarningsPageProps {
  onNavigate: (path: string) => void;
}

export const EarningsPage: React.FC<EarningsPageProps> = ({ onNavigate }) => {
  const { isDemoDataEnabled, activeCurrency } = useMode();
  const [payoutRequested, setPayoutRequested] = useState(false);
  const ledger = mavoraStore.getLedger(isDemoDataEnabled);

  const availableBalance = 1200;
  const pendingEscrow = 1400;
  const lifetimePaid = 3840;

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 3000);
  };

  const handleDownloadInvoice = (entry: FinancialLedgerEntry) => {
    // Generate text invoice
    const content = `MAVORA COMMERCIAL COLLABORATION INVOICE
Transaction ID: ${entry.providerTransactionId}
Date: ${entry.timestamp}
Campaign: ${entry.campaignTitle}
Party: ${entry.partyName}
Gross Amount: ${formatCurrency(entry.grossAmount, entry.currency)}
MAVORA Platform Fee: ${formatCurrency(entry.platformFee, entry.currency)}
Net Payout: ${formatCurrency(entry.netAmount, entry.currency)}
Settlement Status: ${entry.status}
Settlement Method: Regulated Escrow Deposit`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MAVORA-Invoice-${entry.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout currentPath="/earnings" pageTitle="Creator Earnings & Ledger" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Earnings & Financial Ledger
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Immutable double-entry accounting records, escrow deposits, and direct payouts.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRequestPayout}
            disabled={payoutRequested || availableBalance <= 0}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>{payoutRequested ? 'Payout Initiated' : 'Withdraw Available Balance'}</span>
          </Button>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Available to Payout</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-500 tabular-nums">
              {formatCurrency(availableBalance, activeCurrency)}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Funds cleared from approved deliverables. Ready for withdrawal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Pending in Brand Escrow</span>
            <div className="text-3xl font-extrabold font-mono text-[#38BDF8] tabular-nums">
              {formatCurrency(pendingEscrow, activeCurrency)}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Locked in escrow by brands for active in-progress deliverables.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Lifetime Net Earnings</span>
            <div className="text-3xl font-extrabold font-mono text-[var(--color-text-primary)] tabular-nums">
              {formatCurrency(lifetimePaid, activeCurrency)}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
              Total historical payouts processed with 0% platform deductions.
            </p>
          </div>
        </div>

        {/* Financial Ledger Table */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase font-mono text-[var(--color-text-primary)]">
              Ledger Transactions
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">Immutable Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-mono text-[10px] uppercase">
                  <th className="py-2.5">Transaction ID</th>
                  <th className="py-2.5">Campaign / Deal</th>
                  <th className="py-2.5">Gross</th>
                  <th className="py-2.5">Platform Fee</th>
                  <th className="py-2.5">Net Payout</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] font-mono">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[var(--color-bg-subtle)]">
                    <td className="py-3 text-[#38BDF8]">{entry.providerTransactionId}</td>
                    <td className="py-3 font-sans font-medium text-[var(--color-text-primary)]">
                      {entry.campaignTitle}
                    </td>
                    <td className="py-3 text-[var(--color-text-primary)]">
                      {formatCurrency(entry.grossAmount, entry.currency)}
                    </td>
                    <td className="py-3 text-emerald-500">
                      {formatCurrency(entry.platformFee, entry.currency)} (0%)
                    </td>
                    <td className="py-3 font-bold text-emerald-500">
                      {formatCurrency(entry.netAmount, entry.currency)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold">
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(entry)}
                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[#38BDF8] transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
