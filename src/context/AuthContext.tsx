import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getProfileById, saveOnboardingProfile } from '../lib/supabase/client';
import { DbProfile, AuthStateStatus, OnboardingData } from '../types';

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

interface LogInParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: DbProfile | null;
  session: Session | null;
  status: AuthStateStatus;
  isConfigured: boolean;
  needsOnboarding: boolean;
  error: string | null;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  logIn: (params: LogInParams) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logOut: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<{ success: boolean; error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  signInDemoUser: (completedOnboarding?: boolean) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for fallback/demo session persistence when running preview without active DB
const DEMO_SESSION_KEY = 'kollavo_active_session_demo';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStateStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch or construct profile
  const fetchAndSetProfile = useCallback(async (currentUser: User) => {
    try {
      const dbProfile = await getProfileById(currentUser.id);
      if (dbProfile) {
        setProfile(dbProfile);
      } else {
        // Fallback to metadata
        const metadata = currentUser.user_metadata || {};
        const fallbackProfile: DbProfile = {
          id: currentUser.id,
          username: metadata.username || currentUser.email?.split('@')[0] || 'creator',
          full_name: metadata.full_name || 'Creator',
          avatar_url: metadata.avatar_url || null,
          bio: metadata.bio || null,
          category: metadata.category || 'Fashion',
          categories: metadata.categories || ['Fashion'],
          location: metadata.location || null,
          is_public: true,
          onboarding_completed: Boolean(metadata.onboarding_completed),
          created_at: currentUser.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.warn('Profile fetch failed, using metadata fallback:', err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        const storedDemo = localStorage.getItem(DEMO_SESSION_KEY);
        if (storedDemo) {
          try {
            const parsed = JSON.parse(storedDemo);
            if (mounted) {
              setUser(parsed.user);
              setProfile(parsed.profile);
              setStatus('authenticated');
            }
            return;
          } catch (e) {
            localStorage.removeItem(DEMO_SESSION_KEY);
          }
        }
        if (mounted) {
          setStatus('unauthenticated');
        }
        return;
      }

      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('Session retrieval error:', sessionError.message);
        }

        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchAndSetProfile(initialSession.user);
            setStatus('authenticated');
          } else {
            setStatus('unauthenticated');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setStatus('unauthenticated');
        }
      }
    }

    initAuth();

    // Listen for Supabase auth state changes
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;

        if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
          await fetchAndSetProfile(newSession.user);
          setStatus('authenticated');
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setStatus('unauthenticated');
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchAndSetProfile]);

  // Sign up
  const signUp = async ({ email, password, fullName, username }: SignUpParams) => {
    setError(null);
    const normalizedUsername = username.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      // Demo fallback when Supabase keys are not yet configured in .env
      const demoUser: User = {
        id: `demo_${Date.now()}`,
        app_metadata: {},
        user_metadata: { full_name: fullName, username: normalizedUsername, onboarding_completed: false },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: email,
      } as User;

      const demoProfile: DbProfile = {
        id: demoUser.id,
        username: normalizedUsername,
        full_name: fullName,
        avatar_url: null,
        bio: null,
        category: 'Fashion',
        categories: ['Fashion'],
        location: null,
        is_public: true,
        onboarding_completed: false, // New signup starts with onboarding incomplete!
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoUser);
      setProfile(demoProfile);
      setStatus('authenticated');
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
      return { success: true };
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: normalizedUsername,
            onboarding_completed: false,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      if (data.user) {
        if (data.session) {
          setSession(data.session);
          setUser(data.user);

          // Initial profile record with onboarding_completed = false
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: normalizedUsername,
            full_name: fullName.trim(),
            is_public: true,
            onboarding_completed: false,
            updated_at: new Date().toISOString(),
          });

          await fetchAndSetProfile(data.user);
          setStatus('authenticated');
          return { success: true };
        } else {
          return { success: true, requiresEmailConfirmation: true };
        }
      }

      return { success: false, error: 'Sign up failed. Please try again.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Log in
  const logIn = async ({ email, password, rememberMe = true }: LogInParams) => {
    setError(null);

    if (!isSupabaseConfigured) {
      // Demo login
      const demoUser: User = {
        id: 'usr_sarthak_01',
        app_metadata: {},
        user_metadata: { full_name: 'Sarthak Kamdi', username: 'sarthak', onboarding_completed: true },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: email,
      } as User;

      const demoProfile: DbProfile = {
        id: demoUser.id,
        username: 'sarthak',
        full_name: 'Sarthak Kamdi',
        avatar_url: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
        bio: 'Visual director documenting contemporary tailoring, minimalist interiors, and understated luxury through an editorial lens.',
        category: 'Fashion',
        categories: ['Fashion', 'Lifestyle', 'Photography'],
        location: 'Mumbai · London',
        is_public: true,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoUser);
      setProfile(demoProfile);
      setStatus('authenticated');
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
      return { success: true, redirectTo: '/dashboard' };
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        await fetchAndSetProfile(data.user);
        setStatus('authenticated');

        // Check if onboarding completed
        const dbProf = await getProfileById(data.user.id);
        const targetRedirect = dbProf?.onboarding_completed ? '/dashboard' : '/onboarding';

        return { success: true, redirectTo: targetRedirect };
      }

      return { success: false, error: 'Login failed. Please verify credentials.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during login.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Complete Onboarding
  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    const updatedProfile: DbProfile = {
      id: user.id,
      username: data.username.toLowerCase(),
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
      bio: data.bio,
      category: data.categories[0] || 'Fashion',
      categories: data.categories,
      location: data.location,
      is_public: true,
      onboarding_completed: true,
      created_at: profile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfile(updatedProfile);

    // Save to Supabase
    if (isSupabaseConfigured) {
      const res = await saveOnboardingProfile(user.id, data);
      if (!res.success) {
        return res;
      }
    } else {
      // Store in demo session
      localStorage.setItem(
        DEMO_SESSION_KEY,
        JSON.stringify({ user, profile: updatedProfile })
      );
    }

    return { success: true };
  };

  // Log out
  const logOut = async () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem('kollavo_onboarding_draft');
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('SignOut warning:', err);
      }
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setStatus('unauthenticated');
    setError(null);
  };

  // Reset password email
  const resetPasswordForEmail = async (email: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message);
        return { success: false, error: resetError.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset link.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password update failed.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchAndSetProfile(user);
    }
  };

  // Direct demo sign in
  const signInDemoUser = (completedOnboarding: boolean = true) => {
    const demoUser: User = {
      id: 'usr_sarthak_01',
      app_metadata: {},
      user_metadata: { full_name: 'Sarthak Kamdi', username: 'sarthak', onboarding_completed: completedOnboarding },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'sarthakkamdi70@gmail.com',
    } as User;

    const demoProfile: DbProfile = {
      id: demoUser.id,
      username: 'sarthak',
      full_name: 'Sarthak Kamdi',
      avatar_url: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
      bio: 'Visual director documenting contemporary tailoring, minimalist interiors, and understated luxury through an editorial lens.',
      category: 'Fashion',
      categories: ['Fashion', 'Lifestyle', 'Photography'],
      location: 'Mumbai · London',
      is_public: true,
      onboarding_completed: completedOnboarding,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setProfile(demoProfile);
    setStatus('authenticated');
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
  };

  const needsOnboarding = Boolean(
    status === 'authenticated' && profile && !profile.onboarding_completed
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      status,
      isConfigured: isSupabaseConfigured,
      needsOnboarding,
      error,
      signUp,
      logIn,
      logOut,
      completeOnboarding,
      resetPasswordForEmail,
      updatePassword,
      refreshProfile,
      signInDemoUser,
      clearError,
    }),
    [user, profile, session, status, needsOnboarding, error, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
