import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModeProvider, useMode } from './context/ModeContext';
import { ThemeProvider } from './context/ThemeContext';

// Landing Components
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { HowItWorks } from './components/landing/HowItWorks';
import { Pricing } from './components/landing/Pricing';
import { Testimonials } from './components/landing/Testimonials';
import { ClaimUsernameCTA } from './components/landing/ClaimUsernameCTA';
import { FAQ } from './components/landing/FAQ';
import { Footer } from './components/landing/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { ProfilePreviewModal } from './components/profile/ProfilePreviewModal';
import { OnboardingPreviewModal } from './components/onboarding/OnboardingPreviewModal';
import { AuthGuard } from './components/auth/AuthGuard';

// Auth Pages
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Creator Workspace Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProfileEditorPage } from './pages/ProfileEditorPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { MediaKitPage } from './pages/MediaKitPage';
import { RateCardPage } from './pages/RateCardPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { CalendarPage } from './pages/CalendarPage';
import { EarningsPage } from './pages/EarningsPage';
import { SavedBrandsPage } from './pages/SavedBrandsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Brand Workspace Pages
import { BrandDashboardPage } from './pages/BrandDashboardPage';
import { BrandCampaignsPage } from './pages/BrandCampaignsPage';
import { BrandApplicationsPage } from './pages/BrandApplicationsPage';
import { BrandPaymentsPage } from './pages/BrandPaymentsPage';
import { BrandCrmPage } from './pages/BrandCrmPage';
import { BrandProfilePage } from './pages/BrandProfilePage';

// Discovery & Public Pages
import { FindCreatorsPage } from './pages/FindCreatorsPage';
import { PublicCreatorsDirectoryPage } from './pages/PublicCreatorsDirectoryPage';
import { PublicCreatorPage } from './pages/PublicCreatorPage';
import { PublicCampaignsPage } from './pages/PublicCampaignsPage';
import { PublicBrandsDirectoryPage } from './pages/PublicBrandsDirectoryPage';
import { PublicBrandPage } from './pages/PublicBrandPage';

// Admin Page
import { AdminPage } from './pages/AdminPage';

// Informational, Legal & Status Pages
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { HelpPage } from './pages/HelpPage';
import { StatusPage } from './pages/StatusPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [prefilledUsername, setPrefilledUsername] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  const { status, needsOnboarding } = useAuth();
  const { setMode } = useMode();

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Ignore pushState errors in restricted preview frames
    }
    const base = path.split('?')[0];
    setCurrentPath(base || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Automatic onboarding entry check on /dashboard
  useEffect(() => {
    if (status === 'authenticated' && currentPath === '/dashboard' && needsOnboarding) {
      navigateTo('/onboarding');
    }
  }, [status, currentPath, needsOnboarding, navigateTo]);

  // Parse redirect query param if any
  const getRedirectParam = (): string => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      return params.get('redirect') ? decodeURIComponent(params.get('redirect')!) : '/dashboard';
    } catch {
      return '/dashboard';
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup', username?: string) => {
    if (username) setPrefilledUsername(username);
    navigateTo(mode === 'signup' ? '/signup' : '/login');
  };

  const handleClaimUsername = (username: string) => {
    setPrefilledUsername(username);
    navigateTo(`/signup?username=${encodeURIComponent(username)}`);
  };

  const handleExploreClick = () => {
    navigateTo('/campaigns');
  };

  // 1. Authentication Routes
  if (currentPath === '/signup') {
    return <SignupPage onNavigate={navigateTo} prefilledUsername={prefilledUsername} />;
  }

  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigateTo} redirectTo={getRedirectParam()} />;
  }

  if (currentPath === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/reset-password') {
    return <ResetPasswordPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/onboarding') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <OnboardingPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  // 2. Public Creator Profile Route (/creator/[username])
  if (currentPath.startsWith('/creator/')) {
    const rawUsername = currentPath.replace('/creator/', '').split('/')[0] || 'sarthak';
    return <PublicCreatorPage username={rawUsername} onNavigate={navigateTo} />;
  }

  // 3. Brand Routes (Subroutes & Public Profile)
  if (currentPath.startsWith('/brand/')) {
    const subRoute = currentPath.replace('/brand/', '').split('/')[0];
    if (subRoute === 'campaigns') {
      return (
        <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
          <BrandCampaignsPage onNavigate={navigateTo} />
        </AuthGuard>
      );
    }
    if (subRoute === 'applications') {
      return (
        <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
          <BrandApplicationsPage onNavigate={navigateTo} />
        </AuthGuard>
      );
    }
    if (subRoute === 'payments') {
      return (
        <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
          <BrandPaymentsPage onNavigate={navigateTo} />
        </AuthGuard>
      );
    }
    if (subRoute === 'crm') {
      return (
        <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
          <BrandCrmPage onNavigate={navigateTo} />
        </AuthGuard>
      );
    }
    if (subRoute === 'profile') {
      return (
        <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
          <BrandProfilePage onNavigate={navigateTo} />
        </AuthGuard>
      );
    }
    // Otherwise it is a public brand profile slug
    return <PublicBrandPage slug={subRoute || 'acme-luxury'} onNavigate={navigateTo} />;
  }

  // 4. Brand Dashboard & Talent Discovery
  if (currentPath === '/brand-dashboard') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <BrandDashboardPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/discover-creators') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <FindCreatorsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  // 5. Creator Workspace Routes
  if (currentPath === '/dashboard') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <DashboardPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/profile') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <ProfileEditorPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/portfolio') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <PortfolioPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/media-kit') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <MediaKitPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/rate-card') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <RateCardPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/collaborations') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <CollaborationsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/messages') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <MessagesPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/calendar') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <CalendarPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/earnings') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <EarningsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/saved-brands') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <SavedBrandsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/analytics') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <AnalyticsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  if (currentPath === '/settings') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <SettingsPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  // 6. Admin Panel Route
  if (currentPath === '/admin') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <AdminPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  // 7. Public Market Discovery Routes
  if (currentPath === '/creators') {
    return <PublicCreatorsDirectoryPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/campaigns') {
    return <PublicCampaignsPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/brands') {
    return <PublicBrandsDirectoryPage onNavigate={navigateTo} />;
  }

  // 8. Informational, Legal & Status Routes
  if (currentPath === '/about') {
    return <AboutPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/how-it-works') {
    return <HowItWorksPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/pricing') {
    return <PricingPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/contact') {
    return <ContactPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/privacy') {
    return <PrivacyPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/terms') {
    return <TermsPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/cookies') {
    return <CookiesPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/help') {
    return <HelpPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/status') {
    return <StatusPage onNavigate={navigateTo} />;
  }

  // 9. Default Landing Page
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Navigation Bar with Theme & Auth State */}
      <Navbar
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onOpenPreview={() => setProfileModalOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Dual Persona CTAs & Simulator */}
        <Hero
          onOpenAuth={(mode) => handleOpenAuth(mode)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onExploreClick={handleExploreClick}
          onNavigate={navigateTo}
        />

        {/* 6 Features Section */}
        <Features
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenAuth={(mode) => handleOpenAuth(mode)}
        />

        {/* 4 Steps How It Works Section */}
        <HowItWorks onOpenAuth={(mode) => handleOpenAuth(mode)} />

        {/* Transparent Pricing Section */}
        <Pricing onOpenAuth={(mode) => handleOpenAuth(mode)} />

        {/* Social Proof & Testimonials */}
        <Testimonials />

        {/* Claim Handle Banner */}
        <ClaimUsernameCTA onClaimUsername={handleClaimUsername} />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onOpenPreview={() => setProfileModalOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        prefilledUsername={prefilledUsername}
        onSuccess={() => {
          setAuthModalOpen(false);
          navigateTo('/onboarding');
        }}
      />

      {/* Public Profile Simulator Modal */}
      <ProfilePreviewModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Quick Onboarding Preview Modal */}
      <OnboardingPreviewModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onComplete={() => {
          setOnboardingModalOpen(false);
          navigateTo('/dashboard');
        }}
        initialUsername={prefilledUsername || 'sarthak'}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}
