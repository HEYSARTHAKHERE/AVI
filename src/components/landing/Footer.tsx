import React from 'react';

interface FooterProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenPreview: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenPreview }) => {
  return (
    <footer className="bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.08)] py-14 sm:py-20 text-[#575762]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <a
              href="#"
              className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              Kollavo
            </a>
            <p className="mt-3 text-xs sm:text-sm text-[#575762] max-w-sm leading-relaxed">
              The operating system for creator-brand collaborations. Helping creators build a verified online presence, dynamic media kits, and manage brand campaigns.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#888894]">
              <span className="w-2 h-2 rounded-full bg-[#8EA633]"></span>
              <span>All Systems Operational · v1.0.0</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#141416] uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#product" className="hover:text-[#141416] transition-colors">
                  Dashboard Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#141416] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPreview}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Live Creator Profile
                </button>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#141416] transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Creators Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#141416] uppercase tracking-wider mb-3">
              Creators
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Create Profile
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#141416] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Creator Login
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Company Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#141416] uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#privacy" className="hover:text-[#141416] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#141416] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:support@kollavo.com" className="hover:text-[#141416] transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(20,20,22,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888894]">
          <p>© {new Date().getFullYear()} Kollavo Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed with precision</span>
            <span>Zero-pill architecture</span>
            <span>Mobile-first</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
