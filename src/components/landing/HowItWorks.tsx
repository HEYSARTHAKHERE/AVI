import React, { useState } from 'react';
import { Check, ArrowRight, UserPlus, Image, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface HowItWorksProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenAuth }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Create your profile',
      summary: 'Claim your username and set your category, visual direction, and verified credentials.',
      detail:
        'Pick your specialty from fashion, lifestyle, photography, tech, or UGC. MAVORA structures your editorial biography and location effortlessly.',
      icon: UserPlus,
      snippet: {
        heading: 'Profile Setup',
        lines: [
          'Claim vanity handle: /creator/yourname',
          'Select creator vertical & commercial niche',
          'Upload editorial headshot & style portfolio',
        ],
      },
    },
    {
      number: '02',
      title: 'Add your work and social presence',
      summary: 'Connect your Instagram, TikTok, and YouTube with curated portfolio campaigns.',
      detail:
        'Upload your best campaign imagery and case studies. Showcase metrics that matter to luxury brands: impressions, engagement rate, and audience demographics.',
      icon: Image,
      snippet: {
        heading: 'Presence & Archive',
        lines: [
          'Sync verified social accounts and followers',
          'High-resolution masonry campaign showcase',
          'Verified audience geo-demographics breakdown',
        ],
      },
    },
    {
      number: '03',
      title: 'Build your media kit',
      summary: 'Generate an always-up-to-date rate card and commercial press kit with one click.',
      detail:
        'No more exporting broken PDFs from Canva. Your MAVORA media kit updates automatically with live stats, packaged deliverables, and clear commercial pricing.',
      icon: FileText,
      snippet: {
        heading: 'Rate Card Engine',
        lines: [
          'Define package pricing: Reels, UGC, Stills',
          'Real-time engagement verification',
          'Shareable web link + clean print layout',
        ],
      },
    },
    {
      number: '04',
      title: 'Manage collaborations',
      summary: 'Track negotiations, contracts, shooting deadlines, and invoice payouts in one place.',
      detail:
        'Move inbound brand inquiries from inquiry to completed deal. Never miss a delivery deadline, script approval date, or overdue payment again.',
      icon: CheckCircle2,
      snippet: {
        heading: 'Collaboration Pipeline',
        lines: [
          'Inquiry intake with pre-filtered commercial briefs',
          'Visual Kanban stage progression',
          'Deadline alerts and payment settlement status',
        ],
      },
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[rgba(20,20,22,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#575762] mb-3 flex items-center gap-2">
            <span>Workflow</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8EA633]">Four Simple Steps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141416] [text-wrap:balance]">
            From first inquiry to contract payout, streamlined.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#575762] leading-relaxed">
            Spend less time managing paperwork and more time creating standout campaigns.
          </p>
        </div>

        {/* 4 Steps Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 4 Steps List */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, index) => {
              const isSelected = selectedStep === index;
              return (
                <div
                  key={step.number}
                  onClick={() => setSelectedStep(index)}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF9F5] border-[rgba(20,20,22,0.18)] shadow-sm'
                      : 'bg-[#FFFFFF] border-[rgba(20,20,22,0.06)] hover:border-[rgba(20,20,22,0.12)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-xl sm:text-2xl font-bold font-mono-data shrink-0 ${
                        isSelected ? 'text-[#8EA633]' : 'text-[#888894]'
                      }`}
                    >
                      {step.number}
                    </span>

                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[#141416]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[#575762] leading-relaxed">
                        {step.summary}
                      </p>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-[rgba(20,20,22,0.06)] animate-in fade-in duration-200">
                          <p className="text-xs sm:text-sm text-[#141416] leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Step Interactive Preview */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-[#FAF9F5] border border-[rgba(20,20,22,0.1)] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(20,20,22,0.06)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#888894]">
                  Interactive Step Walkthrough
                </span>
                <span className="font-mono-data text-xs text-[#8EA633] font-bold">
                  Step {steps[selectedStep].number} of 04
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[rgba(20,20,22,0.08)] flex items-center justify-center text-[#141416]">
                  {React.createElement(steps[selectedStep].icon, {
                    className: 'w-6 h-6 text-[#8EA633]',
                  })}
                </div>

                <h4 className="text-xl font-bold text-[#141416]">
                  {steps[selectedStep].snippet.heading}
                </h4>

                <div className="space-y-2.5 pt-2">
                  {steps[selectedStep].snippet.lines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#575762]">
                      <div className="w-4 h-4 rounded-full bg-[#8EA633]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#3D4A14]" />
                      </div>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(20,20,22,0.06)]">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => onOpenAuth('signup')}
                >
                  Start with Step {steps[selectedStep].number}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
