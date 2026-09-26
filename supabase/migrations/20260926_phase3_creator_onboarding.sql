-- ==============================================================================
-- KOLLAVO DATABASE MIGRATION: PHASE 3 CREATOR ONBOARDING & PROFILE FOUNDATION
-- File: supabase/migrations/20260926_phase3_creator_onboarding.sql
-- Description: Extends profiles table with categories and onboarding_completed,
--              creates social_accounts table, and configures storage policies.
-- ==============================================================================

-- 1. Ensure profiles table has Phase 3 columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY['Fashion'],
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for onboarding completed flag
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed 
  ON public.profiles (onboarding_completed);

-- 2. Create social_accounts table
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  username TEXT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT unique_profile_platform UNIQUE (profile_id, platform),
  CONSTRAINT platform_check CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'website', 'twitter', 'linkedin', 'twitch'))
);

CREATE INDEX IF NOT EXISTS idx_social_accounts_profile_id 
  ON public.social_accounts (profile_id);

-- Enable RLS on social_accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_accounts
DROP POLICY IF EXISTS "Public can view public social accounts" ON public.social_accounts;
CREATE POLICY "Public can view public social accounts"
  ON public.social_accounts
  FOR SELECT
  USING (is_public = TRUE OR auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can insert their own social accounts"
  ON public.social_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can update their own social accounts"
  ON public.social_accounts
  FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can delete their own social accounts"
  ON public.social_accounts
  FOR DELETE
  USING (auth.uid() = profile_id);

-- 3. Storage bucket setup for avatars
-- Insert 'avatars' bucket into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access
DROP POLICY IF EXISTS "Public read access to avatars" ON storage.objects;
CREATE POLICY "Public read access to avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Storage RLS: Authenticated user upload to their own folder
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
