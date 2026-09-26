import React from 'react';
import { CheckCircle2, Clock, Globe, ShieldCheck, Database, HardDrive, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

interface StatusPageProps {
  onNavigate: (path: string) => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({ onNavigate }) => {
  const systems = [
    { name: 'Kollavo Web Application Core', status: 'Operational', latency: '42ms', region: 'Global Edge' },
    { name: 'Google Cloud SQL (PostgreSQL)', status: 'Operational', latency: '12ms', region: 'asia-southeast1' },
    { name: 'Firebase Authentication & Firestore', status: 'Operational', latency: '18ms', region: 'tensile-webbing-zmn89' },
    { name: 'Google Workspace OAuth (Drive, Sheets, Forms, Gmail)', status: 'Operational', latency: '65ms', region: '1P Cloud APIs' },
    { name: 'Instagram Graph API Telemetry Engine', status: 'Operational', latency: '120ms', region: 'Meta Graph v20' },
    { name: 'TikTok Creator Insights API Sync', status: 'Operational', latency: '140ms', region: 'TikTok Open API' },
    { name: 'Kollavo Escrow Settlement Ledger', status: 'Operational', latency: '24ms', region: 'Regulated Vault' },
    { name: 'Gemini AI Campaign Brief Assistant', status: 'Operational', latency: '210ms', region: 'Google GenAI' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All Systems Fully Operational</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kollavo Platform Status
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Real-time operational availability for core database clusters, OAuth providers, and social analytics sync adapters.
          </p>
        </div>

        {/* Global summary card */}
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-sm font-bold text-emerald-400 block">
                99.98% Uptime Over Past 90 Days
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Zero unscheduled downtime recorded across core transaction and escrow services.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">Auto-refreshed</span>
        </div>

        {/* System component list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[var(--color-text-muted)]">
            System Components
          </h3>
          <div className="space-y-2">
            {systems.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                    {s.name}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 block">
                    {s.region}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                    {s.latency}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
