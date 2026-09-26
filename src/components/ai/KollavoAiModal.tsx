import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Check, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { askKollavoAssistant, generateCampaignBrief, generateCreatorProposal } from '../../lib/gemini';
import { Button } from '../ui/Button';

interface KollavoAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const KollavoAiModal: React.FC<KollavoAiModalProps> = ({ isOpen, onClose, initialPrompt = '' }) => {
  const { activeMode } = useMode();
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string; verifiedTags?: string[] }[]
  >([
    {
      role: 'ai',
      text:
        activeMode === 'creator'
          ? "Hello! I am Kollavo AI for Creators. I can help summarize campaign briefs, prepare compelling collaboration proposals, structure your deliverables timeline, and explain your verified social analytics. What are you working on today?"
          : "Welcome! I am Kollavo AI for Brands. I can help generate structured campaign briefs, identify high-fit creator profiles based on transparent criteria, and organize your collaboration deliverables. How can I assist your campaign?",
      verifiedTags: ['AI Advisory Note · Distinct from Verified Platform Data'],
    },
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await askKollavoAssistant({
        role: activeMode === 'brand' ? 'brand' : 'creator',
        userMessage: userText,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: res.answer,
          verifiedTags: res.verifiedDataTags,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "I experienced a temporary network latency. However, remember the Kollavo collaboration rule: always ground deliverable timelines in verified creator capabilities and clear usage rights.",
          verifiedTags: ['Platform Standard Best Practice'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0E1626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-white">Kollavo AI</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  {activeMode === 'brand' ? 'Brand Campaign Advisor' : 'Creator Assistant'}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Powered by Gemini · Strictly separated from verified platform metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-left">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3.5 ${
                  m.role === 'user'
                    ? 'bg-[#0284C7] text-white'
                    : 'bg-[#111B2E] border border-white/10 text-[#F8FAFC]'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {m.role === 'ai' && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#94A3B8]">
                    <div className="flex items-center gap-1.5 text-[#38BDF8]">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{m.verifiedTags?.[0] || 'AI Advisory Suggestion'}</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(m.text, idx)}
                      className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy draft</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#38BDF8] p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing collaboration requirements with Gemini...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-[#0E1626]/60 border-t border-white/5 flex gap-2 overflow-x-auto text-[11px]">
          {activeMode === 'creator' ? (
            <>
              <button
                type="button"
                onClick={() => setInput('Draft a compelling pitch for a luxury tailoring brand looking for 4K Reels')}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                "Draft pitch for tailoring Reel"
              </button>
              <button
                type="button"
                onClick={() => setInput('How should I package 3 UGC videos with 30-day digital ad usage rights?')}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                "UGC deliverable pricing advice"
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setInput('Generate a campaign brief for our Autumn Cashmere Jacket launch ($4,500 budget)')}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                "Generate Autumn campaign brief"
              </button>
              <button
                type="button"
                onClick={() => setInput('What transparent criteria should I prioritize when reviewing beauty UGC applicants?')}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                "UGC applicant review criteria"
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#0E1626] border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeMode === 'creator'
                ? 'Ask Kollavo AI to help write proposals, summarize briefs, or structure deliverables...'
                : 'Ask Kollavo AI to generate campaign briefs, recommend creator fit factors, or draft terms...'
            }
            className="flex-1 bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
          />
          <Button type="submit" variant="primary" size="sm" disabled={!input.trim() || loading}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
