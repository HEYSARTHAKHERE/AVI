import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('Creator Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans">
      <Navbar
        onNavigate={onNavigate}
        onOpenAuth={(mode) => onNavigate(mode === 'signup' ? '/signup' : '/login')}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact MAVORA Team
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Have questions regarding creator verification, enterprise brand onboarding, or API integrations? Our operations team responds within 24 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold">Inquiry Received</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Thank you {name}. A member of our creator partnerships team will reply to <strong>{email}</strong> shortly.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Inquiry Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8] cursor-pointer"
              >
                <option value="Creator Inquiry">Creator Account & Verification</option>
                <option value="Brand Partnership">Brand Enterprise & Custom Campaigns</option>
                <option value="API Integration">OAuth & Developer API Inquiry</option>
                <option value="Other">General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you?"
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl p-3.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[#38BDF8] resize-none"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4 mr-1.5" />
              <span>Submit Inquiry</span>
            </Button>
          </form>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
