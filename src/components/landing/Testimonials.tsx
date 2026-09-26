import React from 'react';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Kollavo replaced my scattered Canva media kits and Notion pitch logs. Luxury brands take me 10x more seriously when I send a live rate card with verified engagement metrics.',
      author: 'Marcus Vance',
      role: 'Fashion & Tailoring Creator',
      stats: 'Closed $18,400 in 60 days',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      quote:
        'The collaboration pipeline alone saves me 6 hours every Monday. I know exactly which brands owe deliverable revisions, what invoices are pending, and what contracts are locked.',
      author: 'Elena Rostova',
      role: 'UGC & Beauty Specialist',
      stats: '12 Active campaigns managed',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    },
    {
      quote:
        'Having /creator/sarthak on my Instagram bio and pitching agency directors with a clean, branded link increased my brand response rate from 18% to over 44%.',
      author: 'Sarthak Kamdi',
      role: 'Editorial Director & Creator',
      stats: '+142% Inbound Brand Inquiries',
      avatar: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[rgba(20,20,22,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#575762] mb-3 flex items-center gap-2">
            <span>Creator Evidence</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8EA633]">Proven Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141416] [text-wrap:balance]">
            Trusted by creators producing world-class brand campaigns.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F5] rounded-2xl border border-[rgba(20,20,22,0.08)] p-6 sm:p-7 flex flex-col justify-between hover:border-[rgba(20,20,22,0.16)] transition-all"
            >
              <div>
                <Quote className="w-6 h-6 text-[#8EA633] mb-4 opacity-75" />
                <p className="text-sm sm:text-base text-[#141416] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[rgba(20,20,22,0.06)] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#141416]">{item.author}</h4>
                  <p className="text-xs text-[#575762]">{item.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono-data font-bold text-[#3D4A14] bg-[#8EA633]/20 px-2 py-0.5 rounded">
                    {item.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
