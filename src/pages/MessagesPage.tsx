import React, { useState } from 'react';
import { Send, Paperclip, MessageSquare, Check, CheckCheck, Sparkles, Building2, User } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { mavoraStore, MessageThread } from '../data/mavoraStore';
import { useMode } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

interface MessagesPageProps {
  onNavigate: (path: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ onNavigate }) => {
  const { activeMode, isDemoDataEnabled } = useMode();
  const { profile } = useAuth();
  const threads = mavoraStore.getMessages(isDemoDataEnabled);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');

  const currentThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentThread) return;

    mavoraStore.addMessage(
      currentThread.id,
      inputMessage.trim(),
      activeMode === 'brand' ? 'brand' : 'creator',
      profile?.full_name || (activeMode === 'brand' ? 'Acme Atelier' : 'Sarthak Kamdi')
    );
    setInputMessage('');
  };

  return (
    <DashboardLayout currentPath="/messages" pageTitle="Collaboration Messages" onNavigate={onNavigate}>
      <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden shadow-sm text-left">
        {/* Thread List */}
        <div className="w-full md:w-80 border-r border-[var(--color-border-subtle)] flex flex-col bg-[var(--color-bg-subtle)]">
          <div className="p-4 border-b border-[var(--color-border-subtle)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Conversations</h3>
            <span className="text-[11px] text-[var(--color-text-muted)]">Encrypted & campaign-linked</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
            {threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedThreadId(t.id)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  selectedThreadId === t.id ? 'bg-[var(--color-bg-card)]' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center font-bold text-xs shrink-0">
                  {t.brandName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate text-[var(--color-text-primary)]">{t.brandName}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono">Today</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] truncate mt-0.5">
                    {t.campaignTitle}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-1">
                    {t.messages[t.messages.length - 1]?.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread Chat */}
        {currentThread ? (
          <div className="flex-1 flex flex-col bg-[var(--color-bg-card)]">
            {/* Thread Header */}
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-bg-subtle)]">
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                  {activeMode === 'brand' ? currentThread.creatorName : currentThread.brandName}
                </h4>
                <span className="text-[11px] text-[#38BDF8] font-mono">
                  Linked Campaign: {currentThread.campaignTitle}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/collaborations')}
                className="text-xs"
              >
                <span>View Deal Workspace</span>
              </Button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {currentThread.messages.map((m) => {
                const isMe = (activeMode === 'creator' && m.sender === 'creator') || (activeMode === 'brand' && m.sender === 'brand');
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 ${
                        isMe
                          ? 'bg-[#38BDF8] text-white'
                          : 'bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span className="text-[10px] font-mono opacity-80 block mb-1">{m.senderName}</span>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      <span className="text-[9px] font-mono opacity-70 block text-right mt-1.5">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--color-border-subtle)] flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your collaboration message or revision feedback..."
                className="flex-1 bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
              />
              <Button type="submit" variant="primary" size="sm" disabled={!inputMessage.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
            Select a collaboration conversation to begin.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
