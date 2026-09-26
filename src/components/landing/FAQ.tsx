import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is MAVORA different from Linktree or Canva?',
      a: 'Linktree is just a basic list of URLs, and Canva gives you static, quickly outdated PDFs. MAVORA is a complete operating system: it dynamically verifies your social follower stats, packages your commercial deliverables with live pricing, provides an interactive public profile (/creator/[handle]), and tracks your active brand deals and invoices in an integrated collaboration pipeline.',
    },
    {
      q: 'Can brands contact me directly through my profile?',
      a: 'Yes. Every MAVORA profile includes a structured brand inquiry form. When brands submit their campaign brief, deliverables, and budget, the inquiry lands directly in your Collaboration Manager and notifies your email.',
    },
    {
      q: 'Do I have to keep updating my follower counts manually?',
      a: 'No. MAVORA synchronizes with verified social platform APIs (Instagram, TikTok, YouTube) to ensure your media kit statistics and audience demographics reflect real-time numbers.',
    },
    {
      q: 'Can I export my media kit as a PDF?',
      a: 'Yes! Pro creators can export an editorial, print-ready PDF version of their media kit at any time, formatted to luxury agency standards.',
    },
    {
      q: 'Can I manage brand collaborations on mobile?',
      a: 'Absolutely. MAVORA is built mobile-first. The collaboration Kanban and Table views adjust seamlessly so you can accept deals, check contract deliverables, and update statuses from your phone while on shoot.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.06)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#575762] mb-3 flex items-center justify-center gap-2">
            <span>Answers</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8EA633]">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EA633]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-[#141416]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#888894] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#141416]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-[#575762] leading-relaxed border-t border-[rgba(20,20,22,0.04)] pt-4 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
