import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { UserMenu } from '../auth/UserMenu';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenPreview?: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenPreview, onNavigate }) => {
  const { status, profile, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handlePreview = () => {
    if (onOpenPreview) {
      onOpenPreview();
    } else {
      navigate('/creators');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[rgba(20,20,22,0.06)] shadow-xs py-3.5'
          : 'bg-[#FAF9F5] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => navigate('/')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633] inline-block"></span>
            Kollavo
          </button>

          {/* Zone 2: 4 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#575762]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="hover:text-[#141416] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#141416] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handlePreview}
              className="text-[#8EA633] hover:text-[#7E942B] transition-colors text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-[#8EA633]/10 hover:bg-[#8EA633]/20"
            >
              Live Demo
            </button>
          </nav>

          {/* Zone 3: Actions (Logged in vs Logged out) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-xs flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#8EA633]" />
                  <span>Dashboard</span>
                </Button>
                <UserMenu onNavigate={navigate} />
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get started
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger / Status Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-medium px-2.5 py-1.5 bg-[#141416] text-[#FAF9F5] rounded-lg"
              >
                Dashboard
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/signup')}
                className="text-xs px-2.5 py-1"
              >
                Get started
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141416] hover:bg-[#F3F1EC] rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(20,20,22,0.08)] bg-[#FAF9F5] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <div className="flex flex-col gap-3 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-base font-medium text-[#141416] py-2 px-3 rounded-lg hover:bg-[#F3F1EC] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handlePreview();
              }}
              className="text-left text-sm font-semibold text-[#8EA633] py-2 px-3 rounded-lg hover:bg-[#8EA633]/10 transition-colors flex items-center justify-between"
            >
              <span>Explore Public Creator Profile</span>
              <span className="text-xs bg-[#8EA633]/20 px-2 py-0.5 rounded text-[#3D4A14]">/creator/sarthak</span>
            </button>

            {isAuthenticated ? (
              <UserMenu onNavigate={navigate} isMobileDrawer />
            ) : (
              <div className="pt-4 border-t border-[rgba(20,20,22,0.06)] flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                >
                  Create your profile
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
