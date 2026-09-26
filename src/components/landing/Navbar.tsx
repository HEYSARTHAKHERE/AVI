import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserMenu } from '../auth/UserMenu';
import { BrandLogo } from '../brand/BrandLogo';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenPreview?: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenPreview, onNavigate }) => {
  const { status } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Creators', path: '/creators' },
    { label: 'Brands', path: '/brands' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[var(--color-bg-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] shadow-xs py-3.5'
          : 'bg-[var(--color-bg-surface)] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <button
            onClick={() => navigate('/')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            <BrandLogo />
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[var(--color-text-secondary)]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="hover:text-[var(--color-text-primary)] transition-colors py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons: Theme Switcher + Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button (Requirement 9 & 10) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer border border-[var(--color-border-subtle)]"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-xs flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[var(--color-accent-text)]" />
                  <span>Workspace</span>
                </Button>
                <UserMenu onNavigate={navigate} />
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-xs"
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="text-xs"
                >
                  Get started
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-semibold px-2.5 py-1.5 bg-[var(--color-accent)] text-[#10200A] rounded-xl shadow-xs"
              >
                Workspace
              </button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
                className="text-xs px-2.5 py-1"
              >
                Join
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-[var(--color-border-subtle)]"
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
        <div className="md:hidden border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <div className="flex flex-col gap-2 py-2 text-left">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(link.path);
                }}
                className="text-sm font-semibold text-[var(--color-text-primary)] py-2.5 px-3 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-center"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                    className="w-full text-center"
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-center"
                >
                  Go to Workspace
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
