import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OnboardingData, CreatorCategory } from '../types';
import { OnboardingProgress } from '../components/onboarding/OnboardingProgress';
import { IdentityStep } from '../components/onboarding/IdentityStep';
import { CategorySelector } from '../components/onboarding/CategorySelector';
import { SocialLinksStep } from '../components/onboarding/SocialLinksStep';
import { AboutStep } from '../components/onboarding/AboutStep';
import { AvatarUploader } from '../components/onboarding/AvatarUploader';
import { ProfilePreview } from '../components/onboarding/ProfilePreview';
import { OnboardingComplete } from '../components/onboarding/OnboardingComplete';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, ShieldCheck, Check } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (path: string) => void;
}

const getStorageKey = (uid?: string) => `kollavo_onboarding_draft_${uid || 'guest'}`;

const STEPS = [
  { number: '01', title: 'Identity' },
  { number: '02', title: 'Creator Type' },
  { number: '03', title: 'Social Presence' },
  { number: '04', title: 'About You' },
  { number: '05', title: 'Profile Photo' },
  { number: '06', title: 'Preview' },
  { number: '07', title: 'Finish' },
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user, profile, completeOnboarding } = useAuth();
  const storageKey = getStorageKey(user?.id);

  // Try to initialize from localStorage draft or user profile
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.step && parsed.step >= 1 && parsed.step <= 7 ? parsed.step : 1;
      }
    } catch {}
    return 1;
  });

  const [formData, setFormData] = useState<OnboardingData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) return parsed.data;
      }
    } catch {}

    return {
      fullName: profile?.full_name || user?.user_metadata?.full_name || '',
      username: profile?.username || user?.user_metadata?.username || '',
      categories: (profile?.categories as CreatorCategory[]) || (profile?.category ? [profile.category] : ['Fashion']),
      instagram: '',
      youtube: '',
      tiktok: '',
      website: '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      avatarUrl: profile?.avatar_url || null,
    };
  });

  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Sync to local draft storage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ step: currentStep, data: formData })
      );
    } catch (e) {
      console.warn('Could not persist draft to localStorage:', e);
    }
  }, [currentStep, formData, storageKey]);

  const handleNext = async () => {
    if (currentStep === 6) {
      // Finalize and save to Supabase / store
      setIsSaving(true);
      setSaveMessage('Saving creator profile...');
      const res = await completeOnboarding(formData);
      setIsSaving(false);

      if (res.success) {
        setSaveMessage('Saved');
        setCurrentStep(7);
      } else {
        setSaveMessage(res.error || 'Failed to save profile. Try again.');
      }
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCurrentStepValid = stepValidity[currentStep] !== false;

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between text-[#141416]">
      {/* Top Header with Glass Effect */}
      <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[rgba(20,20,22,0.06)] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-[#141416] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633]"></span>
              Kollavo
            </span>
            <span className="text-xs text-[#888894]">·</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#575762] hidden sm:inline">
              Creator Onboarding
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile?.onboarding_completed && (
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 hidden md:inline">
                Profile Active
              </span>
            )}
            {saveMessage && (
              <span className="text-xs text-[#8EA633] font-medium hidden sm:inline">
                {saveMessage}
              </span>
            )}
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-xs text-[#575762] hover:text-[#141416] hover:underline"
            >
              Skip to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-xs border-b border-[rgba(20,20,22,0.04)]">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={7}
          steps={STEPS}
          onStepClick={(step) => {
            if (step <= currentStep) setCurrentStep(step);
          }}
        />
      </div>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {currentStep === 7 ? (
          // STEP 07: Finish Screen (Centered single view)
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-xl p-6 sm:p-10">
            <OnboardingComplete
              data={formData}
              onGoToDashboard={() => {
                localStorage.removeItem(storageKey);
                onNavigate('/dashboard');
              }}
              onViewProfile={(u) => {
                localStorage.removeItem(storageKey);
                onNavigate(`/creator/${u}`);
              }}
            />
          </div>
        ) : (
          // STEPS 01–06: Sophisticated Two-Column Composition on Desktop
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Panel */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-lg p-6 sm:p-8 flex flex-col justify-between min-h-[520px]">
              <div>
                {/* STEP 1: IDENTITY */}
                {currentStep === 1 && (
                  <IdentityStep
                    fullName={formData.fullName}
                    username={formData.username}
                    currentUserId={user?.id}
                    onUpdate={(d) => setFormData((prev) => ({ ...prev, ...d }))}
                    onValidChange={(v) =>
                      setStepValidity((prev) => ({ ...prev, 1: v }))
                    }
                  />
                )}

                {/* STEP 2: CREATOR TYPE */}
                {currentStep === 2 && (
                  <CategorySelector
                    selectedCategories={formData.categories}
                    onChange={(cats) =>
                      setFormData((prev) => ({ ...prev, categories: cats }))
                    }
                    onValidChange={(v) =>
                      setStepValidity((prev) => ({ ...prev, 2: v }))
                    }
                  />
                )}

                {/* STEP 3: SOCIAL PRESENCE */}
                {currentStep === 3 && (
                  <SocialLinksStep
                    instagram={formData.instagram}
                    youtube={formData.youtube}
                    tiktok={formData.tiktok}
                    website={formData.website}
                    onUpdate={(d) => setFormData((prev) => ({ ...prev, ...d }))}
                    onValidChange={(v) =>
                      setStepValidity((prev) => ({ ...prev, 3: v }))
                    }
                  />
                )}

                {/* STEP 4: ABOUT YOU */}
                {currentStep === 4 && (
                  <AboutStep
                    bio={formData.bio}
                    location={formData.location}
                    onUpdate={(d) => setFormData((prev) => ({ ...prev, ...d }))}
                    onValidChange={(v) =>
                      setStepValidity((prev) => ({ ...prev, 4: v }))
                    }
                  />
                )}

                {/* STEP 5: PROFILE PHOTO */}
                {currentStep === 5 && (
                  <AvatarUploader
                    avatarUrl={formData.avatarUrl}
                    fullName={formData.fullName}
                    userId={user?.id}
                    onUpdate={(url) =>
                      setFormData((prev) => ({ ...prev, avatarUrl: url }))
                    }
                    onValidChange={(v) =>
                      setStepValidity((prev) => ({ ...prev, 5: v }))
                    }
                  />
                )}

                {/* STEP 6: FULL PREVIEW CONFIRMATION */}
                {currentStep === 6 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
                        Review your public presence.
                      </h2>
                      <p className="mt-2 text-sm text-[#575762] leading-relaxed">
                        This is how your creator identity will appear to luxury brands, agencies, and collaborators.
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] rounded-xl space-y-3 text-xs text-[#575762]">
                      <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,20,22,0.06)]">
                        <span className="font-semibold text-[#141416]">Public Shareable URL:</span>
                        <span className="font-mono text-[#8EA633] font-bold">
                          kollavo.com/creator/{formData.username}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141416]">Full Name:</span>
                        <span className="text-[#141416] font-semibold">{formData.fullName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141416]">Primary Category:</span>
                        <span>{formData.categories[0] || 'Fashion'} ({formData.categories.length} selected)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141416]">Location:</span>
                        <span>{formData.location || 'Global'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141416]">Connected Channels:</span>
                        <span>{[formData.instagram, formData.youtube, formData.tiktok, formData.website].filter(Boolean).length} channels</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[rgba(20,20,22,0.06)]">
                        <span className="font-medium text-[#141416]">Profile Status:</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Ready to publish
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-[rgba(20,20,22,0.06)] rounded-xl text-[11px] text-[#575762] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#8EA633] shrink-0" />
                      <span>
                        Your creator profile is protected by PostgreSQL Row Level Security (RLS). Only you can modify your portfolio, rates, and personal details.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-8 mt-6 border-t border-[rgba(20,20,22,0.06)] flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleBack}
                    disabled={isSaving}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid || isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving profile...</span>
                    </div>
                  ) : currentStep === 6 ? (
                    <div className="flex items-center gap-2">
                      <span>Publish & Finish</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column: Live Creator Preview (Sticky on desktop) */}
            <div className="lg:col-span-5 sticky top-24">
              <ProfilePreview
                fullName={formData.fullName}
                username={formData.username}
                categories={formData.categories}
                bio={formData.bio}
                location={formData.location}
                avatarUrl={formData.avatarUrl}
                instagram={formData.instagram}
                youtube={formData.youtube}
                tiktok={formData.tiktok}
                website={formData.website}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-[#888894] border-t border-[rgba(20,20,22,0.06)]">
        Kollavo Creator Operating System · Phase 3 Onboarding & Identity
      </footer>
    </div>
  );
};
