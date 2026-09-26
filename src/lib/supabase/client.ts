import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DbProfile, DbSocialAccount, DbService, DbNotification, CreatorProfile, OnboardingData, CreatorCategory } from '../../types';
import { normalizeSocialUrl } from '../validation';
import { mockCreator } from '../../data/mockCreator';

// Read from both VITE_ and NEXT_PUBLIC_ prefixes for maximum compatibility
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  '';

// Check if credentials are realistically configured
export const isSupabaseConfigured: boolean =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key') &&
  supabaseUrl.startsWith('https://');

// Initialize the Supabase client
const defaultUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-mavora.supabase.co';
const defaultKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(defaultUrl, defaultKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'mavora-auth-token',
  },
});

/**
 * Check if a normalized username is available in the profiles table.
 */
export async function checkUsernameAvailability(username: string, currentUserId?: string): Promise<{
  available: boolean;
  error?: string;
}> {
  const normalized = username.trim().toLowerCase();
  
  // Format check
  const formatRegex = /^[a-z0-9_.]{3,30}$/;
  if (!formatRegex.test(normalized)) {
    return {
      available: false,
      error: 'Username must be 3–30 lowercase letters, numbers, underscores, or periods only.',
    };
  }

  // Reserved system slugs
  const reservedSlugs = [
    'admin', 'api', 'app', 'auth', 'dashboard', 'settings', 'login', 'signup',
    'explore', 'creator', 'media-kit', 'portfolio', 'collaborations', 'pricing',
    'terms', 'privacy', 'help', 'support', 'null', 'undefined', 'root', 'onboarding'
  ];
  if (reservedSlugs.includes(normalized)) {
    return {
      available: false,
      error: 'This username is reserved. Please choose another.',
    };
  }

  if (!isSupabaseConfigured) {
    const isMockTaken = normalized === 'taken_user' || (normalized === 'mavora' && currentUserId !== 'demo_admin');
    return {
      available: !isMockTaken,
      error: isMockTaken ? 'That username is already taken.' : undefined,
    };
  }

  try {
    let query = supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', normalized);

    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query.maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Database username check warning:', error.message);
      return { available: true };
    }

    if (data) {
      return {
        available: false,
        error: 'That username is already taken.',
      };
    }

    return { available: true };
  } catch (err: unknown) {
    console.warn('Network error checking username:', err);
    return { available: true };
  }
}

/**
 * Fetch profile record by Supabase Auth User ID
 */
export async function getProfileById(userId: string): Promise<DbProfile | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    return data as DbProfile;
  } catch (err) {
    console.error('Fetch profile exception:', err);
    return null;
  }
}

/**
 * Upload profile avatar to Supabase Storage (avatars bucket)
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    // Convert to persistent Data URL for instant local demo preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload profile photo to storage.');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Fetch social accounts for a profile
 */
export async function fetchSocialAccounts(profileId: string): Promise<DbSocialAccount[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.warn('Error fetching social accounts:', error.message);
      return [];
    }

    return (data || []) as DbSocialAccount[];
  } catch {
    return [];
  }
}

/**
 * Save complete Onboarding profile to Supabase
 */
export async function saveOnboardingProfile(
  userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  const normalizedUsername = data.username.trim().toLowerCase();

  const primaryCategory = data.categories[0] || 'Fashion';

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    // 1. Update Profile row
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.fullName.trim(),
        username: normalizedUsername,
        bio: data.bio.trim() || null,
        location: data.location.trim() || null,
        category: primaryCategory,
        categories: data.categories,
        avatar_url: data.avatarUrl || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      throw new Error(profileError.message);
    }

    // 2. Upsert social accounts
    const socialsToSave: Array<{ platform: 'instagram' | 'youtube' | 'tiktok' | 'website'; raw: string }> = [
      { platform: 'instagram', raw: data.instagram },
      { platform: 'youtube', raw: data.youtube },
      { platform: 'tiktok', raw: data.tiktok },
      { platform: 'website', raw: data.website },
    ];

    for (const item of socialsToSave) {
      if (item.raw.trim()) {
        const norm = normalizeSocialUrl(item.platform, item.raw);
        if (norm.valid && norm.normalizedUrl) {
          await supabase.from('social_accounts').upsert(
            {
              profile_id: userId,
              platform: item.platform,
              url: norm.normalizedUrl,
              username: norm.username || null,
              is_public: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'profile_id,platform' }
          );
        }
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error while saving creator profile.';
    return { success: false, error: msg };
  }
}

/**
 * Fetch public creator profile for /creator/[username]
 */
export async function getPublicCreatorProfile(username: string): Promise<{ profile: CreatorProfile | null; isPrivate?: boolean }> {
  const normalized = username.trim().toLowerCase();

  // If Supabase is connected, query database
  if (isSupabaseConfigured) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', normalized)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching public profile:', error.message);
      }

      if (profile) {
        if (!profile.is_public) {
          return { profile: null, isPrivate: true };
        }

        // Fetch public social accounts
        const { data: socials } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('profile_id', profile.id)
          .eq('is_public', true);

        const mappedSocials = (socials || []).map((s: any) => ({
          platform: s.platform,
          username: s.username || s.platform,
          followers: s.platform === 'instagram' ? 12000 : 8500, // estimated starting reach
          url: s.url,
        }));

        const creatorProfile: CreatorProfile = {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          headline: `${profile.category || 'Creator'} · ${profile.location || 'Global'}`,
          bio: profile.bio || '',
          avatarUrl: profile.avatar_url || '',
          category: (profile.category as CreatorCategory) || 'Fashion',
          location: profile.location || 'Global',
          verified: false,
          featuredRate: 1500,
          completionPercentage: 85,
          socials: mappedSocials.length > 0 ? mappedSocials : mockCreator.socials,
          services: mockCreator.services,
          portfolio: mockCreator.portfolio,
          recentCollaborations: mockCreator.recentCollaborations,
          audienceDemographics: mockCreator.audienceDemographics,
        };

        return { profile: creatorProfile };
      }
    } catch (err) {
      console.warn('Public profile fetch error:', err);
    }
  }

  // Check demo user
  if (normalized === 'sarthak' || normalized === 'sarthakkamdi') {
    // Check if demo user toggled privacy in localStorage
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('mavora_active_session_demo') : null;
      if (stored) {
        const { profile: localProf } = JSON.parse(stored);
        if (localProf && (localProf.username?.toLowerCase() === normalized || normalized === 'sarthak')) {
          if (localProf.is_public === false) {
            return { profile: null, isPrivate: true };
          }
        }
      }
    } catch {}

    return { profile: mockCreator };
  }

  // Check active demo user session in localStorage
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mavora_active_session_demo') : null;
    if (stored) {
      const { profile: localProf } = JSON.parse(stored);
      if (localProf && localProf.username?.toLowerCase() === normalized) {
        if (localProf.is_public === false) {
          return { profile: null, isPrivate: true };
        }

        const creatorProfile: CreatorProfile = {
          id: localProf.id,
          username: localProf.username,
          fullName: localProf.full_name,
          headline: `${localProf.category || 'Creator'} · ${localProf.location || 'Global'}`,
          bio: localProf.bio || '',
          avatarUrl: localProf.avatar_url || '',
          category: (localProf.category as CreatorCategory) || 'Fashion',
          location: localProf.location || 'Global',
          verified: false,
          featuredRate: 1500,
          completionPercentage: 85,
          socials: mockCreator.socials,
          services: mockCreator.services,
          portfolio: mockCreator.portfolio,
          recentCollaborations: mockCreator.recentCollaborations,
          audienceDemographics: mockCreator.audienceDemographics,
        };

        return { profile: creatorProfile };
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  return { profile: null };
}

// ============================================================================
// PHASE 4: SERVICES & NOTIFICATIONS HELPERS
// ============================================================================

const SERVICES_DEMO_KEY = 'mavora_services_demo';
const NOTIFICATIONS_DEMO_KEY = 'mavora_notifications_demo';

const DEFAULT_DEMO_SERVICES: DbService[] = [
  {
    id: 'srv_1',
    profile_id: 'usr_sarthak_01',
    name: 'Brand Campaign Reel',
    description: 'High-production 30-45s vertical reel featuring styled wardrobe or product integration.',
    starting_price: 1500,
    currency: 'USD',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv_2',
    profile_id: 'usr_sarthak_01',
    name: 'Creative Direction & Stills',
    description: 'Editorial photo suite (8 high-res stills) with full digital rights and retouching.',
    starting_price: 2200,
    currency: 'USD',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv_3',
    profile_id: 'usr_sarthak_01',
    name: 'UGC Content Suite',
    description: '3 organic-feel video concepts delivered without watermarks for brand ad spend.',
    starting_price: 950,
    currency: 'USD',
    is_public: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_DEMO_NOTIFICATIONS: DbNotification[] = [
  {
    id: 'notif_1',
    profile_id: 'usr_sarthak_01',
    type: 'welcome',
    title: 'Welcome to MAVORA',
    message: 'Your creator workspace is active. Manage your profile, showcase your services, and share your public presence.',
    is_read: true,
    link: '/dashboard',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'notif_2',
    profile_id: 'usr_sarthak_01',
    type: 'profile_incomplete',
    title: 'Complete your profile foundation',
    message: 'Add your services and pricing to increase brand inquiry conversions.',
    is_read: false,
    link: '/profile',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

/**
 * Fetch creator services
 */
export async function fetchServices(profileId: string): Promise<DbService[]> {
  if (!isSupabaseConfigured) {
    try {
      const stored = localStorage.getItem(`${SERVICES_DEMO_KEY}_${profileId}`);
      if (stored) return JSON.parse(stored);
      // Return defaults for demo profile
      return DEFAULT_DEMO_SERVICES;
    } catch {
      return DEFAULT_DEMO_SERVICES;
    }
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching services:', error.message);
      return [];
    }

    return (data || []) as DbService[];
  } catch (err) {
    console.error('Fetch services exception:', err);
    return [];
  }
}

/**
 * Save or update a service
 */
export async function saveService(
  profileId: string,
  service: { id?: string; name: string; description?: string | null; starting_price?: number | null; currency?: string; is_public?: boolean }
): Promise<{ success: boolean; data?: DbService; error?: string }> {
  if (!isSupabaseConfigured) {
    try {
      const current = await fetchServices(profileId);
      let updated: DbService[];
      const targetId = service.id || `srv_${Date.now()}`;
      const newService: DbService = {
        id: targetId,
        profile_id: profileId,
        name: service.name,
        description: service.description || null,
        starting_price: service.starting_price ?? null,
        currency: service.currency || 'USD',
        is_public: service.is_public ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (service.id) {
        updated = current.map((s) => (s.id === service.id ? { ...s, ...newService } : s));
      } else {
        updated = [newService, ...current];
      }

      localStorage.setItem(`${SERVICES_DEMO_KEY}_${profileId}`, JSON.stringify(updated));
      return { success: true, data: newService };
    } catch (e) {
      return { success: false, error: 'Could not save service locally.' };
    }
  }

  try {
    const payload = {
      profile_id: profileId,
      name: service.name,
      description: service.description || null,
      starting_price: service.starting_price ?? null,
      currency: service.currency || 'USD',
      is_public: service.is_public ?? true,
      updated_at: new Date().toISOString(),
      ...(service.id ? { id: service.id } : {}),
    };

    const { data, error } = await supabase
      .from('services')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DbService };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error while saving service.';
    return { success: false, error: msg };
  }
}

/**
 * Delete a service
 */
export async function deleteService(
  profileId: string,
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    try {
      const current = await fetchServices(profileId);
      const filtered = current.filter((s) => s.id !== serviceId);
      localStorage.setItem(`${SERVICES_DEMO_KEY}_${profileId}`, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete service locally.' };
    }
  }

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('profile_id', profileId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting service.';
    return { success: false, error: msg };
  }
}

/**
 * Fetch notifications for current user
 */
export async function fetchNotifications(profileId: string): Promise<DbNotification[]> {
  if (!isSupabaseConfigured) {
    try {
      const stored = localStorage.getItem(`${NOTIFICATIONS_DEMO_KEY}_${profileId}`);
      if (stored) return JSON.parse(stored);
      return DEFAULT_DEMO_NOTIFICATIONS;
    } catch {
      return DEFAULT_DEMO_NOTIFICATIONS;
    }
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching notifications:', error.message);
      return [];
    }

    return (data || []) as DbNotification[];
  } catch {
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(profileId: string, notificationId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    try {
      const current = await fetchNotifications(profileId);
      const updated = current.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
      localStorage.setItem(`${NOTIFICATIONS_DEMO_KEY}_${profileId}`, JSON.stringify(updated));
    } catch {}
    return;
  }

  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('profile_id', profileId);
  } catch (err) {
    console.warn('Mark read exception:', err);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(profileId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    try {
      const current = await fetchNotifications(profileId);
      const updated = current.map((n) => ({ ...n, is_read: true }));
      localStorage.setItem(`${NOTIFICATIONS_DEMO_KEY}_${profileId}`, JSON.stringify(updated));
    } catch {}
    return;
  }

  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('profile_id', profileId);
  } catch (err) {
    console.warn('Mark all read exception:', err);
  }
}

/**
 * Update full profile details (Full name, username, bio, location, categories, is_public)
 */
export async function updateFullProfile(
  userId: string,
  updates: Partial<DbProfile>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    try {
      const stored = localStorage.getItem('mavora_active_session_demo');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedProfile = { ...parsed.profile, ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('mavora_active_session_demo', JSON.stringify({ ...parsed, profile: updatedProfile }));
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Could not update profile locally.' };
    }
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database update failed.';
    return { success: false, error: msg };
  }
}

