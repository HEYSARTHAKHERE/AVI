import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DbProfile, DbSocialAccount, DbService, CreatorCategory } from '../types';
import { 
  User, 
  FileText, 
  Globe, 
  Briefcase, 
  Eye, 
  Lock, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  ExternalLink,
  AtSign,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  DollarSign
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AvatarUploader } from '../components/onboarding/AvatarUploader';
import { CategorySelector } from '../components/onboarding/CategorySelector';
import { ProfilePreviewModal } from '../components/profile/ProfilePreviewModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  checkUsernameAvailability, 
  updateFullProfile, 
  fetchServices, 
  saveService, 
  deleteService, 
  fetchSocialAccounts 
} from '../lib/supabase/client';
import { normalizeSocialUrl } from '../lib/validation';

interface ProfileEditorPageProps {
  onNavigate: (path: string) => void;
  initialTab?: 'profile' | 'about' | 'socials' | 'services' | 'visibility';
}

type TabType = 'profile' | 'about' | 'socials' | 'services' | 'visibility';

export const ProfileEditorPage: React.FC<ProfileEditorPageProps> = ({
  onNavigate,
  initialTab = 'profile',
}) => {
  const { user, profile, refreshProfile } = useAuth();

  // Active tab state (reads from URL query if present)
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab') as TabType;
      if (t && ['profile', 'about', 'socials', 'services', 'visibility'].includes(t)) {
        return t;
      }
    } catch {}
    return initialTab;
  });

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [initialUsername] = useState(profile?.username || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [categories, setCategories] = useState<CreatorCategory[]>(
    profile?.categories || (profile?.category ? [profile.category] : ['Fashion'])
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [bio, setBio] = useState(profile?.bio || '');
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);

  // Social Links State
  const [socials, setSocials] = useState<Array<{ platform: 'instagram' | 'youtube' | 'tiktok' | 'website'; url: string; is_public: boolean }>>([
    { platform: 'instagram', url: '', is_public: true },
    { platform: 'tiktok', url: '', is_public: true },
    { platform: 'youtube', url: '', is_public: true },
    { platform: 'website', url: '', is_public: true },
  ]);

  // Services State
  const [services, setServices] = useState<DbService[]>([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<string>('');
  const [newServiceCurrency, setNewServiceCurrency] = useState('USD');

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  // Unsaved changes & Save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setLocation(profile.location || '');
      setCategories(profile.categories || (profile.category ? [profile.category] : ['Fashion']));
      setAvatarUrl(profile.avatar_url);
      setBio(profile.bio || '');
      setIsPublic(profile.is_public ?? true);
    }
  }, [profile]);

  // Load services and socials
  useEffect(() => {
    if (user?.id) {
      fetchServices(user.id).then(setServices);
      fetchSocialAccounts(user.id).then((saved) => {
        if (saved && saved.length > 0) {
          setSocials(
            saved.map((s) => ({
              platform: s.platform,
              url: s.url,
              is_public: s.is_public,
            }))
          );
        }
      });
    }
  }, [user?.id]);

  // Check username availability when changed
  useEffect(() => {
    if (!username) {
      setUsernameStatus('invalid');
      setUsernameMessage('Username cannot be empty.');
      return;
    }

    const norm = username.trim().toLowerCase();
    if (norm === initialUsername.toLowerCase()) {
      setUsernameStatus('available');
      setUsernameMessage('Current handle');
      return;
    }

    const formatRegex = /^[a-z0-9_.]{3,30}$/;
    if (!formatRegex.test(norm)) {
      setUsernameStatus('invalid');
      setUsernameMessage('3–30 lowercase alphanumeric, underscore, or period characters only.');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(norm, user?.id);
      if (res.available) {
        setUsernameStatus('available');
        setUsernameMessage(`mavora.com/creator/${norm} is available`);
      } else {
        setUsernameStatus('taken');
        setUsernameMessage(res.error || 'Username already taken');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, initialUsername, user?.id]);

  // Track unsaved changes
  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  const handleDiscardChanges = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setLocation(profile.location || '');
      setCategories(profile.categories || (profile.category ? [profile.category] : ['Fashion']));
      setAvatarUrl(profile.avatar_url);
      setBio(profile.bio || '');
      setIsPublic(profile.is_public ?? true);
    }
    setHasUnsavedChanges(false);
    setGeneralError(null);
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setGeneralError(null);

    if (!fullName.trim()) {
      setGeneralError('Full name cannot be empty.');
      return;
    }

    if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
      setGeneralError('Please fix username error before saving.');
      return;
    }

    setIsSaving(true);

    try {
      const normUsername = username.trim().toLowerCase();
      const primaryCategory = categories[0] || 'Fashion';

      const res = await updateFullProfile(user.id, {
        full_name: fullName.trim(),
        username: normUsername,
        location: location.trim() || null,
        category: primaryCategory,
        categories: categories,
        avatar_url: avatarUrl,
        bio: bio.trim() || null,
        is_public: isPublic,
      });

      if (!res.success) {
        setGeneralError(res.error || 'Failed to update profile.');
        setIsSaving(false);
        return;
      }

      await refreshProfile();
      setHasUnsavedChanges(false);
      setIsSaving(false);
      setSaveSuccessNotice('Profile updated successfully.');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unexpected error during save.';
      setGeneralError(msg);
      setIsSaving(false);
    }
  };

  // Add Service Handler
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newServiceName.trim()) return;

    const priceNum = newServicePrice.trim() ? parseFloat(newServicePrice) : null;
    const res = await saveService(user.id, {
      name: newServiceName.trim(),
      description: newServiceDesc.trim() || null,
      starting_price: priceNum,
      currency: newServiceCurrency,
      is_public: true,
    });

    if (res.success && res.data) {
      setServices([res.data, ...services]);
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
      setIsAddingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!user) return;
    await deleteService(user.id, serviceId);
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'profile', label: 'Identity & Categories', icon: User },
    { id: 'about', label: 'Biography', icon: FileText },
    { id: 'socials', label: 'Connected Channels', icon: Globe },
    { id: 'services', label: 'Services & Rates', icon: Briefcase },
    { id: 'visibility', label: 'Profile Visibility', icon: Eye },
  ];

  return (
    <DashboardLayout
      currentPath="/profile"
      pageTitle="Profile Management"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 pb-20 text-left">
        {/* Top Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-5 sm:p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
              Edit Creator Profile
            </h2>
            <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
              Manage your verified identity, creative biography, commercial services, and public visibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="text-xs"
            >
              <Eye className="w-4 h-4 mr-1.5 text-[#8EA633]" />
              <span>Preview Profile</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAll}
              disabled={isSaving || !hasUnsavedChanges}
              className="text-xs"
            >
              {isSaving ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Save changes</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {saveSuccessNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSaveSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {generalError && (
          <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{generalError}</span>
            </div>
            <button
              onClick={() => setGeneralError(null)}
              className="text-red-700 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Editor Main Layout (Left Tabs + Right Form Viewport) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Section Navigation */}
          <div className="lg:col-span-3 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-3 space-y-1">
            <span className="text-[10px] font-bold text-[#888894] uppercase tracking-wider block px-3 py-2">
              Editor Sections
            </span>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#141416] text-[#FAF9F5] shadow-xs'
                      : 'text-[#575762] hover:text-[#141416] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8EA633]' : 'text-[#888894]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Tab Content Panels */}
          <div className="lg:col-span-9 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8">
            {/* 1. IDENTITY & CATEGORIES TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#141416]">
                    Creator Identity & Categories
                  </h3>
                  <p className="text-xs text-[#575762] mt-0.5">
                    Your name, claimed handle, and creative disciplines represent your brand across the MAVORA network.
                  </p>
                </div>

                {/* Avatar Uploader */}
                <AvatarUploader
                  avatarUrl={avatarUrl}
                  fullName={fullName}
                  userId={user?.id}
                  onUpdate={(url) => {
                    setAvatarUrl(url);
                    markDirty();
                  }}
                  onValidChange={() => {}}
                />

                <div className="space-y-4 pt-4 border-t border-[rgba(20,20,22,0.06)]">
                  <Input
                    label="Full Display Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      markDirty();
                    }}
                    placeholder="e.g. Sarthak Kamdi"
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />

                  {/* Username with Live Checker and URL Change Warning */}
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-[#141416] mb-1.5">
                      Claimed Username Handle
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-[#888894]">
                        <AtSign className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          const clean = e.target.value.toLowerCase().replace(/\s+/g, '');
                          setUsername(clean);
                          markDirty();
                        }}
                        className={`w-full bg-[#FFFFFF] text-[#141416] text-sm rounded-xl pl-10 pr-10 py-2.5 min-h-[44px] border focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] transition-all ${
                          usernameStatus === 'taken' || usernameStatus === 'invalid'
                            ? 'border-red-500'
                            : usernameStatus === 'available'
                            ? 'border-emerald-600'
                            : 'border-[rgba(20,20,22,0.12)]'
                        }`}
                        required
                      />
                      <div className="absolute right-3.5 flex items-center">
                        {usernameStatus === 'checking' && (
                          <Loader2 className="w-4 h-4 text-[#8EA633] animate-spin" />
                        )}
                        {usernameStatus === 'available' && (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        )}
                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    {usernameMessage && (
                      <p
                        className={`mt-1.5 text-xs ${
                          usernameStatus === 'available'
                            ? 'text-emerald-700 font-medium'
                            : 'text-red-600'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}

                    {username !== initialUsername && (
                      <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                        Notice: Changing your username handle will update your public URL to{' '}
                        <strong>mavora.com/creator/{username}</strong>.
                      </p>
                    )}
                  </div>

                  <Input
                    label="Primary City / Base Location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      markDirty();
                    }}
                    placeholder="e.g. Mumbai · London"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    helperText="General city or region. Never enter a residential address."
                  />
                </div>

                {/* Categories Selector */}
                <div className="pt-4 border-t border-[rgba(20,20,22,0.06)]">
                  <CategorySelector
                    selectedCategories={categories}
                    onChange={(cats) => {
                      setCategories(cats);
                      markDirty();
                    }}
                    onValidChange={() => {}}
                  />
                </div>
              </div>
            )}

            {/* 2. BIOGRAPHY TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#141416]">
                    Creator Biography
                  </h3>
                  <p className="text-xs text-[#575762] mt-0.5">
                    State your visual specialty, artistic focus, or key commercial mediums. Brands read this first.
                  </p>
                </div>

                <div className="text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#141416]">
                      Biography (Max 250 characters)
                    </label>
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        bio.length >= 250 ? 'text-amber-600 font-bold' : 'text-[#888894]'
                      }`}
                    >
                      {bio.length} / 250
                    </span>
                  </div>

                  <textarea
                    rows={5}
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value.slice(0, 250));
                      markDirty();
                    }}
                    placeholder="Fashion creator and model sharing style, lifestyle and creative work."
                    className="w-full bg-[#FFFFFF] text-[#141416] placeholder-[#888894] border border-[rgba(20,20,22,0.12)] text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633] resize-none leading-relaxed transition-all"
                  />

                  <div className="p-3 bg-[#FAF9F5] border border-[rgba(20,20,22,0.06)] rounded-xl text-xs text-[#575762] space-y-1">
                    <span className="font-semibold text-[#141416] block">
                      Editorial guidance:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      "Visual director documenting contemporary tailoring, minimalist interiors, and understated luxury through an editorial lens."
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBio(profile?.bio || '');
                        markDirty();
                      }}
                      className="text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Reset to saved
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SOCIAL CHANNELS TAB */}
            {activeTab === 'socials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#141416]">
                    Connected Social Channels
                  </h3>
                  <p className="text-xs text-[#575762] mt-0.5">
                    Connect your public channels so brands can verify your audience presence.
                  </p>
                </div>

                <div className="space-y-3">
                  {socials.map((s, idx) => {
                    return (
                      <div
                        key={s.platform}
                        className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 sm:w-44 shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] flex items-center justify-center text-[#141416]">
                            {s.platform === 'instagram' ? (
                              <Instagram className="w-4 h-4 text-[#E1306C]" />
                            ) : s.platform === 'youtube' ? (
                              <Youtube className="w-4 h-4 text-[#FF0000]" />
                            ) : s.platform === 'tiktok' ? (
                              <span className="font-bold text-[9px] bg-black text-white px-1 py-0.5 rounded">TT</span>
                            ) : (
                              <Globe className="w-4 h-4 text-[#575762]" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#141416] capitalize">
                            {s.platform}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={s.url}
                            onChange={(e) => {
                              const next = [...socials];
                              next[idx].url = e.target.value;
                              setSocials(next);
                              markDirty();
                            }}
                            placeholder={
                              s.platform === 'instagram'
                                ? '@handle or instagram.com/...'
                                : s.platform === 'youtube'
                                ? 'youtube.com/@channel'
                                : s.platform === 'tiktok'
                                ? '@handle or tiktok.com/@...'
                                : 'https://yourwebsite.com'
                            }
                            className="w-full bg-[#FFFFFF] text-xs text-[#141416] border border-[rgba(20,20,22,0.12)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633]"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 text-xs text-[#575762] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={s.is_public}
                              onChange={(e) => {
                                const next = [...socials];
                                next[idx].is_public = e.target.checked;
                                setSocials(next);
                                markDirty();
                              }}
                              className="rounded border-[rgba(20,20,22,0.2)] text-[#8EA633] focus:ring-[#8EA633]"
                            />
                            <span>Public</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SERVICES & RATES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#141416]">
                      What Do You Offer?
                    </h3>
                    <p className="text-xs text-[#575762] mt-0.5">
                      Define the services and packages you offer for brand partnerships (pricing is optional).
                    </p>
                  </div>

                  {!isAddingService && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsAddingService(true)}
                      className="text-xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add service</span>
                    </Button>
                  )}
                </div>

                {/* Add Service Card */}
                {isAddingService && (
                  <form
                    onSubmit={handleCreateService}
                    className="p-5 rounded-xl border border-[#8EA633] bg-[#8EA633]/5 space-y-4 animate-in fade-in"
                  >
                    <span className="text-xs font-bold text-[#141416] block uppercase tracking-wider">
                      New Commercial Service
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <Input
                          label="Service Name"
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          placeholder="e.g. Dedicated Instagram Reel or Fashion Lookbook"
                          required
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <Input
                          label="Starting Price (Optional)"
                          type="number"
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                          placeholder="1500"
                          leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141416] mb-1.5">
                        Deliverables & Scope Description
                      </label>
                      <textarea
                        rows={2}
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="Briefly describe what is included (e.g. 1 Reel, 30 days usage, creative direction)..."
                        className="w-full bg-[#FFFFFF] text-xs text-[#141416] border border-[rgba(20,20,22,0.12)] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#8EA633]/60 focus:border-[#8EA633]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => setIsAddingService(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="text-xs"
                      >
                        Save Service
                      </Button>
                    </div>
                  </form>
                )}

                {/* Services List */}
                <div className="space-y-3">
                  {services.length === 0 && !isAddingService ? (
                    <div className="p-8 text-center bg-[#FAF9F5]/70 rounded-xl border border-dashed border-[rgba(20,20,22,0.1)] space-y-2">
                      <Briefcase className="w-8 h-8 text-[#888894] mx-auto" />
                      <span className="text-xs font-semibold text-[#141416] block">
                        No services added yet
                      </span>
                      <p className="text-[11px] text-[#575762] max-w-sm mx-auto">
                        Add the types of campaigns, content formats, or modeling packages you provide to brands.
                      </p>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingService(true)}
                          className="text-xs"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add your first service
                        </Button>
                      </div>
                    </div>
                  ) : (
                    services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#141416]">
                              {srv.name}
                            </span>
                            {srv.starting_price !== null && (
                              <span className="text-xs font-mono font-bold text-[#8EA633] bg-[#8EA633]/15 px-2 py-0.5 rounded">
                                From ${srv.starting_price} {srv.currency}
                              </span>
                            )}
                          </div>
                          {srv.description && (
                            <p className="text-xs text-[#575762] leading-relaxed">
                              {srv.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 text-[#888894] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 5. VISIBILITY TAB */}
            {activeTab === 'visibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#141416]">
                    Profile Visibility Controls
                  </h3>
                  <p className="text-xs text-[#575762] mt-0.5">
                    Control whether your public page is reachable by luxury brands, agencies, and visitors.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Public Option */}
                  <div
                    onClick={() => {
                      setIsPublic(true);
                      markDirty();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isPublic
                        ? 'border-[#8EA633] bg-[#8EA633]/5 ring-1 ring-[#8EA633]/30'
                        : 'border-[rgba(20,20,22,0.08)] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPublic ? 'bg-[#8EA633] text-[#141416]' : 'border border-[rgba(20,20,22,0.2)]'
                      }`}
                    >
                      {isPublic && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm font-bold text-[#141416] block">
                        Public Profile (Recommended)
                      </span>
                      <p className="text-xs text-[#575762] leading-relaxed">
                        Anyone with your link can view your creator bio, categories, connected channels, and media kit at{' '}
                        <strong className="font-mono text-[#141416]">
                          mavora.com/creator/{username}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  {/* Private Option */}
                  <div
                    onClick={() => {
                      setIsPublic(false);
                      markDirty();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      !isPublic
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/30'
                        : 'border-[rgba(20,20,22,0.08)] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        !isPublic ? 'bg-amber-600 text-white' : 'border border-[rgba(20,20,22,0.2)]'
                      }`}
                    >
                      {!isPublic && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm font-bold text-[#141416] block flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Private Profile
                      </span>
                      <p className="text-xs text-[#575762] leading-relaxed">
                        Only you can view your profile while logged in. External visitors to{' '}
                        <strong className="font-mono text-[#141416]">
                          mavora.com/creator/{username}
                        </strong>{' '}
                        will see a private notice: "This creator profile isn't public yet."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Save Bar when unsaved changes exist */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-4 left-4 right-4 md:left-72 md:right-8 z-40 bg-[#141416] text-[#FAF9F5] p-4 rounded-2xl shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA633] animate-pulse"></span>
              <span className="text-xs font-semibold">
                You have unsaved changes to your creator profile.
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#888894] hover:text-white transition-colors"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-bold bg-[#8EA633] hover:bg-[#8EA633]/90 text-[#141416] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Live Preview Simulator Modal */}
      <ProfilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </DashboardLayout>
  );
};
