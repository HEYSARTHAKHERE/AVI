import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useMode } from '../context/ModeContext';

interface CalendarPageProps {
  onNavigate: (path: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const { activeMode } = useMode();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const events = [
    {
      date: '2026-10-15',
      time: '18:00',
      title: 'Draft Submission Deadline',
      campaign: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
      party: 'Acme Studio Atelier',
      type: 'Deliverable',
    },
    {
      date: '2026-10-18',
      time: '12:00',
      title: 'Revision Approval Window Closes',
      campaign: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
      party: 'Acme Studio Atelier',
      type: 'Review',
    },
    {
      date: '2026-10-22',
      time: '09:00',
      title: 'Scheduled Social Publication & Live Post',
      campaign: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
      party: 'Instagram Reel + Stories',
      type: 'Publication',
    },
    {
      date: '2026-10-25',
      time: '17:00',
      title: 'Escrow Payout Settlement Release ($1,400 USD)',
      campaign: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
      party: 'Regulated Escrow',
      type: 'Payment',
    },
  ];

  return (
    <DashboardLayout currentPath="/calendar" pageTitle="Collaboration Calendar" onNavigate={onNavigate}>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Collaboration & Deliverables Calendar
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Timezone-aware deliverable deadlines, review windows, and escrow release milestones.
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
            <span>Local Timezone: </span>
            <strong className="text-[var(--color-text-primary)]">{userTimezone}</strong>
          </div>
        </div>

        {/* Timeline View */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Upcoming Milestones (October 2026)</h3>
            <span className="text-xs text-[#38BDF8] font-mono">4 active timeline items</span>
          </div>

          <div className="space-y-3">
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase">
                      {new Date(evt.date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xs font-bold font-mono text-[var(--color-text-primary)]">
                      {new Date(evt.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">{evt.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                        {evt.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                      {evt.campaign} · {evt.party}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-[var(--color-text-muted)] shrink-0">
                  <span>{evt.time} {userTimezone.split('/')[1] || 'UTC'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
