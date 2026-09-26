-- ==============================================================================
-- MAVORA DATABASE MIGRATION: PHASE 2 AUTHENTICATION & PROFILES
-- File: supabase/migrations/20260925_create_profiles.sql
-- Description: Sets up the profiles table, constraints, RLS policies, and triggers.
-- ==============================================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT NULL,
  bio TEXT NULL,
  category TEXT NULL,
  location TEXT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Username constraint: 3-30 chars, lowercase alphanumeric, underscore, period
  CONSTRAINT username_format_check CHECK (username ~ '^[a-z0-9_.]{3,30}$')
);

-- Case-insensitive unique index on normalized username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower 
  ON public.profiles (lower(username));

CREATE INDEX IF NOT EXISTS idx_profiles_category 
  ON public.profiles (category);

-- 2. Setup Updated At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated_at ON public.profiles;
CREATE TRIGGER on_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- A. Public read access: Anyone can view public profiles, or users can view their own private profile
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (is_public = TRUE OR auth.uid() = id);

-- B. Insert: Authenticated user can create their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- C. Update: Authenticated user can update only their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- D. Delete: Authenticated user can delete only their own profile
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- 5. Automatic Profile Provisioning on User Signup (Auth Hook Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  desired_username TEXT;
  desired_fullname TEXT;
BEGIN
  desired_username := lower(trim(COALESCE(NEW.raw_user_meta_data->>'username', '')));
  desired_fullname := trim(COALESCE(NEW.raw_user_meta_data->>'full_name', 'Creator'));

  IF desired_username = '' THEN
    desired_username := 'creator_' || substr(NEW.id::text, 1, 8);
  END IF;

  INSERT INTO public.profiles (id, username, full_name, is_public)
  VALUES (NEW.id, desired_username, desired_fullname, TRUE)
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- In case of username clash in raw trigger, append random suffix
    INSERT INTO public.profiles (id, username, full_name, is_public)
    VALUES (NEW.id, desired_username || '_' || substr(NEW.id::text, 1, 4), desired_fullname, TRUE)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
