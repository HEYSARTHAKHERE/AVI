import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PublicCreatorPage } from './pages/PublicCreatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfileEditorPage } from './pages/ProfileEditorPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { MediaKitPage } from './pages/MediaKitPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthGuard } from './components/auth/AuthGuard';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [prefilledUsername, setPrefilledUsername] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  const { status, needsOnboarding } = useAuth();

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
    } catch (e) {
      // Ignore pushState errors in restricted environments
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
    if (currentPath !== '/') {
      navigateTo('/#features');
    } else {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // ROUTE 1: Signup Page
  if (currentPath === '/signup') {
    return (
      <SignupPage
        onNavigate={navigateTo}
        prefilledUsername={prefilledUsername}
      />
    );
  }

  // ROUTE 2: Login Page
  if (currentPath === '/login') {
    return (
      <LoginPage
        onNavigate={navigateTo}
        redirectTo={getRedirectParam()}
      />
    );
  }

  // ROUTE 3: Forgot Password Page
  if (currentPath === '/forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigate={navigateTo}
      />
    );
  }

  // ROUTE 4: Reset Password Page
  if (currentPath === '/reset-password') {
    return (
      <ResetPasswordPage
        onNavigate={navigateTo}
      />
    );
  }

  // ROUTE 5: Creator Onboarding Page (Phase 3 Core Experience)
  if (currentPath === '/onboarding') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <OnboardingPage onNavigate={navigateTo} />
      </AuthGuard>
    );
  }

  // ROUTE 6: Public Creator Profile Route (/creator/[username])
  if (currentPath.startsWith('/creator/')) {
    const rawUsername = currentPath.replace('/creator/', '').split('/')[0] || 'sarthak';
    return (
      <PublicCreatorPage
        username={rawUsername}
        onNavigate={navigateTo}
      />
    );
  }

  // ROUTE 7: Protected Dashboard & Workspace Routes
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

  if (currentPath === '/collaborations') {
    return (
      <AuthGuard onNavigate={navigateTo} currentPath={currentPath}>
        <CollaborationsPage onNavigate={navigateTo} />
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

  // ROUTE 8: Landing Page (Default)
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141416] flex flex-col selection:bg-[#8EA633]/25 selection:text-[#141416]">
      {/* Sticky Navigation Bar with Auth State */}
      <Navbar
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onOpenPreview={() => setProfileModalOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Dashboard Preview */}
        <Hero
          onOpenAuth={(mode) => handleOpenAuth(mode)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onExploreClick={handleExploreClick}
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
      />

      {/* Auth Modal (Optional Quick Modal for direct interactions) */}
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

      {/* Public Profile Simulator Modal (Desktop / Mobile Preview) */}
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
