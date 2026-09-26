import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore, googleAuthProvider, setCachedAccessToken } from '../lib/firebase';
import { DbProfile, AuthStateStatus, OnboardingData } from '../types';

export interface User {
  id: string;
  uid: string;
  email: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  app_metadata?: Record<string, any>;
  user_metadata?: {
    full_name?: string;
    username?: string;
    avatar_url?: string | null;
    onboarding_completed?: boolean;
    role?: 'creator' | 'brand' | 'admin';
    [key: string]: any;
  };
  aud?: string;
  created_at?: string;
}

export type Session = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: User;
} | null;

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
  activeRole: 'creator' | 'brand' | 'admin';
  setActiveRole: (role: 'creator' | 'brand' | 'admin') => void;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  logIn: (params: LogInParams) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logOut: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<{ success: boolean; error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  signInDemoUser: (completedOnboarding?: boolean, role?: 'creator' | 'brand' | 'admin') => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatFirebaseAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please log in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been deactivated.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed attempts. Please try again later.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStateStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'creator' | 'brand' | 'admin'>('creator');

  const clearError = useCallback(() => setError(null), []);

  // Fetch or bootstrap profile document from Firestore
  const fetchAndSetProfile = useCallback(async (fbUser: FirebaseUser): Promise<DbProfile> => {
    try {
      const userDocRef = doc(firestore, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const data = snap.data();
        const loadedProfile: DbProfile = {
          id: fbUser.uid,
          username: data.username || fbUser.email?.split('@')[0] || 'creator',
          full_name: data.full_name || data.fullName || fbUser.displayName || 'Creator',
          avatar_url: data.avatar_url || data.avatarUrl || fbUser.photoURL || null,
          bio: data.bio || null,
          category: data.category || (data.categories?.[0]) || 'Fashion',
          categories: data.categories || ['Fashion'],
          location: data.location || null,
          is_public: data.is_public !== undefined ? data.is_public : true,
          onboarding_completed: Boolean(data.onboarding_completed),
          created_at: data.created_at || fbUser.metadata?.creationTime || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };

        setProfile(loadedProfile);
        if (data.role && (data.role === 'creator' || data.role === 'brand' || data.role === 'admin')) {
          setActiveRole(data.role);
        }
        return loadedProfile;
      } else {
        // Bootstrap initial user doc in Firestore
        const defaultUsername = (fbUser.email ? fbUser.email.split('@')[0] : 'creator')
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '');
        const defaultName = fbUser.displayName || 'Creator';

        const initialProfile: DbProfile = {
          id: fbUser.uid,
          username: defaultUsername,
          full_name: defaultName,
          avatar_url: fbUser.photoURL || null,
          bio: 'Verified creator on MAVORA.',
          category: 'Fashion',
          categories: ['Fashion'],
          location: 'Global',
          is_public: true,
          onboarding_completed: false,
          created_at: fbUser.metadata?.creationTime || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          await setDoc(userDocRef, {
            id: fbUser.uid,
            email: fbUser.email,
            username: defaultUsername,
            full_name: defaultName,
            avatar_url: fbUser.photoURL || null,
            role: 'creator',
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          // Bootstrap public creator profile
          const creatorDocRef = doc(firestore, 'creator_profiles', fbUser.uid);
          await setDoc(creatorDocRef, {
            id: fbUser.uid,
            creatorUid: fbUser.uid,
            username: defaultUsername,
            fullName: defaultName,
            avatarUrl: fbUser.photoURL || null,
            headline: 'Visual Creator & Collaborator',
            bio: 'Verified creator on MAVORA.',
            category: 'Fashion',
            verified: true,
            featuredRate: 1200,
            completionPercentage: 50,
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Initial profile doc bootstrap warning:', dbErr);
        }

        setProfile(initialProfile);
        return initialProfile;
      }
    } catch (err) {
      console.warn('Profile fetch note (using fallback):', err);
      const fallback: DbProfile = {
        id: fbUser.uid,
        username: fbUser.email?.split('@')[0] || 'creator',
        full_name: fbUser.displayName || 'Creator',
        avatar_url: fbUser.photoURL || null,
        bio: null,
        category: 'Fashion',
        categories: ['Fashion'],
        location: null,
        is_public: true,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallback);
      return fallback;
    }
  }, []);

  // Primary Firebase Auth Observer
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!isMounted) return;

      if (fbUser) {
        let idToken: string | undefined;
        try {
          idToken = await fbUser.getIdToken();
        } catch {}

        const authUser: User = {
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email,
          emailVerified: fbUser.emailVerified,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          app_metadata: {},
          user_metadata: {
            full_name: fbUser.displayName || 'Creator',
            username: fbUser.email ? fbUser.email.split('@')[0] : 'creator',
            avatar_url: fbUser.photoURL,
            onboarding_completed: false,
            role: 'creator',
          },
          aud: 'authenticated',
          created_at: fbUser.metadata?.creationTime || new Date().toISOString(),
        };

        if (isMounted) {
          setUser(authUser);
          setSession({
            access_token: idToken,
            user: authUser,
          });
        }

        const loadedProf = await fetchAndSetProfile(fbUser);
        if (isMounted && loadedProf) {
          setUser((prev) => {
            if (!prev) return authUser;
            return {
              ...prev,
              user_metadata: {
                ...prev.user_metadata,
                full_name: loadedProf.full_name,
                username: loadedProf.username,
                avatar_url: loadedProf.avatar_url,
                onboarding_completed: loadedProf.onboarding_completed,
              },
            };
          });
          setStatus('authenticated');
        }
      } else {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchAndSetProfile]);

  // Sign up with Firebase Auth
  const signUp = async ({ email, password, fullName, username }: SignUpParams) => {
    setError(null);
    const normalizedUsername = username.trim().toLowerCase();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      try {
        await updateProfile(fbUser, { displayName: fullName.trim() });
      } catch (profErr) {
        console.warn('Firebase profile update warning:', profErr);
      }

      // Persist user record to Firestore
      const userDocRef = doc(firestore, 'users', fbUser.uid);
      const userData = {
        id: fbUser.uid,
        email: email.trim(),
        username: normalizedUsername,
        full_name: fullName.trim(),
        role: 'creator',
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await setDoc(userDocRef, userData);

      // Create initial creator profile
      const creatorDocRef = doc(firestore, 'creator_profiles', fbUser.uid);
      await setDoc(creatorDocRef, {
        id: fbUser.uid,
        creatorUid: fbUser.uid,
        username: normalizedUsername,
        fullName: fullName.trim(),
        headline: 'Creator on MAVORA',
        category: 'Fashion',
        verified: true,
        completionPercentage: 35,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const initialProfile: DbProfile = {
        id: fbUser.uid,
        username: normalizedUsername,
        full_name: fullName.trim(),
        avatar_url: null,
        bio: null,
        category: 'Fashion',
        categories: ['Fashion'],
        location: null,
        is_public: true,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(initialProfile);
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Log in with Firebase Auth
  const logIn = async ({ email, password }: LogInParams) => {
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      let targetRedirect = '/dashboard';
      try {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data();
          targetRedirect = data.onboarding_completed ? '/dashboard' : '/onboarding';
        }
      } catch (e) {
        console.warn('Login redirection check note:', e);
      }

      return { success: true, redirectTo: targetRedirect };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Sign in with Google (Firebase GoogleAuthProvider with Workspace Scopes)
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;
      if (token) {
        setCachedAccessToken(token);
      }

      const fbUser = result.user;
      let targetRedirect = '/dashboard';

      try {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);

        if (!snap.exists()) {
          const defaultUsername = (fbUser.email ? fbUser.email.split('@')[0] : 'creator')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '');

          await setDoc(userDocRef, {
            id: fbUser.uid,
            email: fbUser.email,
            username: defaultUsername,
            full_name: fbUser.displayName || 'Creator',
            avatar_url: fbUser.photoURL || null,
            role: 'creator',
            onboarding_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          const creatorDocRef = doc(firestore, 'creator_profiles', fbUser.uid);
          await setDoc(creatorDocRef, {
            id: fbUser.uid,
            creatorUid: fbUser.uid,
            username: defaultUsername,
            fullName: fbUser.displayName || 'Creator',
            avatarUrl: fbUser.photoURL || null,
            headline: 'Verified Creator',
            bio: 'Verified creator on MAVORA.',
            category: 'Fashion',
            verified: true,
            featuredRate: 1400,
            completionPercentage: 80,
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          const data = snap.data();
          targetRedirect = data.onboarding_completed ? '/dashboard' : '/onboarding';
        }
      } catch (dbErr) {
        console.warn('Google sign-in firestore check note:', dbErr);
      }

      return { success: true, redirectTo: targetRedirect };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Complete onboarding
  const completeOnboarding = async (data: OnboardingData) => {
    const currentUid = auth.currentUser?.uid || user?.id;
    if (!currentUid) {
      return { success: false, error: 'User is not authenticated.' };
    }

    const updatedProfile: DbProfile = {
      id: currentUid,
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

    try {
      // 1. Update Firestore users collection
      const userDocRef = doc(firestore, 'users', currentUid);
      await setDoc(
        userDocRef,
        {
          id: currentUid,
          username: updatedProfile.username,
          full_name: updatedProfile.full_name,
          avatar_url: updatedProfile.avatar_url,
          bio: updatedProfile.bio,
          category: updatedProfile.category,
          categories: updatedProfile.categories,
          location: updatedProfile.location,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Update Firestore creator_profiles collection
      const creatorDocRef = doc(firestore, 'creator_profiles', currentUid);
      await setDoc(
        creatorDocRef,
        {
          id: currentUid,
          creatorUid: currentUid,
          username: updatedProfile.username,
          fullName: updatedProfile.full_name,
          avatarUrl: updatedProfile.avatar_url,
          bio: updatedProfile.bio,
          headline: `${data.categories.join(' · ')} Creator`,
          category: updatedProfile.category,
          location: updatedProfile.location,
          verified: true,
          completionPercentage: 90,
          isPublic: true,
          socials: [
            { platform: 'instagram', username: data.instagram, followers: 45000, url: `https://instagram.com/${data.instagram.replace('@', '')}` },
            { platform: 'youtube', username: data.youtube, followers: 18000, url: `https://youtube.com/@${data.youtube.replace('@', '')}` },
            { platform: 'tiktok', username: data.tiktok, followers: 62000, url: `https://tiktok.com/@${data.tiktok.replace('@', '')}` },
          ].filter((s) => Boolean(s.username)),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setProfile(updatedProfile);
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            full_name: updatedProfile.full_name,
            username: updatedProfile.username,
            avatar_url: updatedProfile.avatar_url,
            onboarding_completed: true,
          },
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error saving onboarding data to Firestore:', err);
      return { success: false, error: err.message || 'Failed to persist profile.' };
    }
  };

  // Log out
  const logOut = async () => {
    setCachedAccessToken(null);
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signOut warning:', err);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setStatus('unauthenticated');
  };

  // Reset password email
  const resetPasswordForEmail = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    setError(null);
    if (!auth.currentUser) {
      return { success: false, error: 'User is not signed in.' };
    }
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Refresh profile from Firestore
  const refreshProfile = async () => {
    const currentUid = auth.currentUser?.uid || user?.id;
    if (!currentUid) return;

    try {
      const userDocRef = doc(firestore, 'users', currentUid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const refreshed: DbProfile = {
          id: currentUid,
          username: data.username || 'creator',
          full_name: data.full_name || data.fullName || 'Creator',
          avatar_url: data.avatar_url || data.avatarUrl || null,
          bio: data.bio || null,
          category: data.category || 'Fashion',
          categories: data.categories || ['Fashion'],
          location: data.location || null,
          is_public: data.is_public !== undefined ? data.is_public : true,
          onboarding_completed: Boolean(data.onboarding_completed),
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };
        setProfile(refreshed);
      }
    } catch (err) {
      console.warn('Error refreshing profile:', err);
    }
  };

  // Instant demo user sign-in for previewing different roles
  const signInDemoUser = (completedOnboarding: boolean = true, role: 'creator' | 'brand' | 'admin' = 'creator') => {
    setActiveRole(role);
    const isBrand = role === 'brand';
    const isAdmin = role === 'admin';

    const demoUser: User = {
      id: isBrand ? 'usr_brand_01' : isAdmin ? 'usr_admin_01' : 'usr_sarthak_01',
      uid: isBrand ? 'usr_brand_01' : isAdmin ? 'usr_admin_01' : 'usr_sarthak_01',
      email: isBrand ? 'contact@acme-atelier.com' : isAdmin ? 'ops@mavora.ai' : 'sarthakkamdi70@gmail.com',
      displayName: isBrand ? 'Acme Atelier' : isAdmin ? 'MAVORA Operations' : 'Sarthak Kamdi',
      photoURL: isBrand
        ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80'
        : '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
      app_metadata: {},
      user_metadata: {
        full_name: isBrand ? 'Acme Atelier' : isAdmin ? 'MAVORA Operations' : 'Sarthak Kamdi',
        username: isBrand ? 'acme_atelier' : isAdmin ? 'admin' : 'sarthak',
        avatar_url: isBrand
          ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80'
          : '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
        onboarding_completed: completedOnboarding,
        role: role,
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const demoProfile: DbProfile = {
      id: demoUser.id,
      username: isBrand ? 'acme_atelier' : isAdmin ? 'admin' : 'sarthak',
      full_name: isBrand ? 'Acme Atelier' : isAdmin ? 'MAVORA Operations' : 'Sarthak Kamdi',
      avatar_url: demoUser.photoURL || null,
      bio: isBrand
        ? 'London based luxury tailoring and leather goods atelier collaborating with international visual directors.'
        : 'Visual director documenting contemporary tailoring, minimalist interiors, and understated luxury through an editorial lens.',
      category: 'Fashion',
      categories: ['Fashion', 'Lifestyle', 'Photography'],
      location: isBrand ? 'London · Paris' : 'Mumbai · London',
      is_public: true,
      onboarding_completed: completedOnboarding,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setProfile(demoProfile);
    setStatus('authenticated');
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
      isConfigured: true,
      needsOnboarding,
      error,
      activeRole,
      setActiveRole,
      signInWithGoogle,
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
    [user, profile, session, status, needsOnboarding, error, activeRole, clearError]
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
