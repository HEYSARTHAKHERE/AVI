import React from 'react';

interface FooterProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenPreview?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenPreview, onNavigate }) => {
  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (onNavigate) {
      e?.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="bg-[#FAF9F5] border-t border-[rgba(20,20,22,0.08)] py-14 sm:py-20 text-[#575762]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <button
              onClick={() => handleNav('/')}
              className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2 text-left"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              Kollavo
            </button>
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
                <button onClick={() => handleNav('/campaigns')} className="hover:text-[#141416] transition-colors text-left">
                  Browse Campaigns
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/creators')} className="hover:text-[#141416] transition-colors text-left">
                  Discover Creators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPreview ? onOpenPreview() : handleNav('/creators')}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Live Creator Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/pricing')} className="hover:text-[#141416] transition-colors text-left">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Creators Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#141416] uppercase tracking-wider mb-3">
              Creators & Brands
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : handleNav('/signup')}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Create Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/how-it-works')} className="hover:text-[#141416] transition-colors text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('login') : handleNav('/login')}
                  className="hover:text-[#141416] transition-colors text-left"
                >
                  Member Login
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/brands')} className="hover:text-[#141416] transition-colors text-left">
                  For Brands & Agencies
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Company Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#141416] uppercase tracking-wider mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-[#141416] transition-colors text-left">
                  About Kollavo
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/privacy')} className="hover:text-[#141416] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/terms')} className="hover:text-[#141416] transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#141416] transition-colors text-left">
                  Contact Support
                </button>
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
