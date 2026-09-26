import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreatorCategory } from '../../types';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Instagram, 
  Youtube,
  CheckCircle2 
} from 'lucide-react';
import { mockCreator } from '../../data/mockCreator';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  initialUsername?: string;
  initialName?: string;
}

export const OnboardingPreviewModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialUsername = 'sarthak',
  initialName = 'Sarthak Kamdi',
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    name: initialName,
    username: initialUsername,
    category: 'Fashion' as CreatorCategory,
    instagram: 'sarthakkamdi',
    tiktok: 'sarthakcreates',
    youtube: 'SarthakStudio',
    avatarUrl: mockCreator.avatarUrl,
    bio: 'Visual director documenting contemporary tailoring, minimalist interiors, and understated luxury through an editorial lens.',
  });

  const categories: CreatorCategory[] = [
    'Fashion',
    'Beauty',
    'Lifestyle',
    'Fitness',
    'Photography',
    'UGC',
    'Gaming',
    'Travel',
    'Music',
    'Technology',
    'Other',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Creator Onboarding"
      description={`Step ${currentStep} of ${totalSteps} — Set up your professional creator workspace.`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#575762]">
            <span>Setup Progress</span>
            <span className="font-mono-data font-semibold text-[#8EA633]">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-[#EBE8E1] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#8EA633] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: Name + Username */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#141416]">
                What is your creator identity?
              </h3>
              <p className="text-xs text-[#575762]">
                Your display name and public profile URL.
              </p>
            </div>

            <Input
              label="Full Name or Brand Title"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarthak Kamdi"
            />

            <Input
              label="Vanity Username / Handle"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="sarthak"
              helperText={`Your public address: kollavo.com/creator/${formData.username}`}
            />
          </div>
        )}

        {/* STEP 2: Category Selection */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#141416]">
                Select your primary creator category
              </h3>
              <p className="text-xs text-[#575762]">
                Helps brands and agencies discover your specialization.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#141416] text-[#FAF9F5] border-[#141416] shadow-xs'
                        : 'bg-[#FAF9F5] text-[#141416] border-[rgba(20,20,22,0.08)] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Social Accounts */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#141416]">
                Connect your social channels
              </h3>
              <p className="text-xs text-[#575762]">
                Kollavo synchronizes your public follower stats and audience reach.
              </p>
            </div>

            <Input
              label="Instagram Handle"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@handle"
              leftIcon={<Instagram className="w-4 h-4" />}
            />

            <Input
              label="TikTok Handle"
              value={formData.tiktok}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              placeholder="@handle"
            />

            <Input
              label="YouTube Channel Name"
              value={formData.youtube}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              placeholder="Channel name or handle"
              leftIcon={<Youtube className="w-4 h-4" />}
            />
          </div>
        )}

        {/* STEP 4: Profile Photo */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#141416]">
                Upload your creator portrait
              </h3>
              <p className="text-xs text-[#575762]">
                Editorial, clean portraits convert 3x more brand inquiries.
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.08)]">
              <img
                src={formData.avatarUrl}
                alt="Profile Preview"
                className="w-20 h-20 rounded-2xl object-cover border border-[rgba(20,20,22,0.12)] shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#141416] block">
                  Current Editorial Headshot
                </span>
                <p className="text-[11px] text-[#575762]">
                  High resolution JPG or PNG, minimum 600x600px.
                </p>
                <button
                  type="button"
                  className="text-xs font-medium px-3 py-1.5 bg-[#FFFFFF] border border-[rgba(20,20,22,0.1)] rounded-lg text-[#141416] hover:bg-[#F3F1EC] transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Short Bio */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#141416]">
                Write your creator biography
              </h3>
              <p className="text-xs text-[#575762]">
                A concise 2-3 sentence overview of your visual style, location, and aesthetic.
              </p>
            </div>

            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-sm p-3.5 border border-[rgba(20,20,22,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EA633] bg-white leading-relaxed"
              placeholder="Describe your creative work, previous brand collaborations, and geographic base..."
            ></textarea>
          </div>
        )}

        {/* STEP 6: Finish / Ready */}
        {currentStep === 6 && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#8EA633]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#141416]">
                You're ready to launch, {formData.name.split(' ')[0]}!
              </h3>
              <p className="mt-1 text-xs text-[#575762] max-w-sm mx-auto">
                Your profile is initialized at <span className="font-mono text-[#141416] font-semibold">kollavo.com/creator/{formData.username}</span>.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.06)] max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#888894]">Niche Category:</span>
                <span className="font-semibold text-[#141416]">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888894]">Connected Channels:</span>
                <span className="font-semibold text-[#141416]">Instagram, TikTok, YouTube</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888894]">Rate Card Status:</span>
                <span className="font-semibold text-[#8EA633]">Live & Accepting Briefs</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-[rgba(20,20,22,0.06)] flex items-center justify-between">
          {currentStep > 1 && currentStep < totalSteps ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
          >
            {currentStep === totalSteps ? (
              <span>Enter Workspace</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
