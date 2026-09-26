-- ==============================================================================
-- MAVORA DATABASE MIGRATION: PHASE 3 ONBOARDING, CATEGORIES & SOCIAL PRESENCE
-- File: supabase/migrations/20260925_phase3_onboarding.sql
-- Description: Extends profiles, creates categories, profile_categories, 
--              social_accounts tables, RLS policies, and storage bucket.
-- ==============================================================================

-- 1. Extend profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- 2. Scalable Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed predefined creator categories
INSERT INTO public.categories (name, slug) VALUES
  ('Fashion', 'fashion'),
  ('Beauty', 'beauty'),
  ('Lifestyle', 'lifestyle'),
  ('Fitness', 'fitness'),
  ('Gaming', 'gaming'),
  ('Photography', 'photography'),
  ('UGC', 'ugc'),
  ('Music', 'music'),
  ('Travel', 'travel'),
  ('Technology', 'technology'),
  ('Food', 'food'),
  ('Education', 'education'),
  ('Other', 'other')
ON CONFLICT (name) DO NOTHING;

-- 3. Junction Table: profile_categories
CREATE TABLE IF NOT EXISTS public.profile_categories (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (profile_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_categories_profile 
  ON public.profile_categories(profile_id);

-- 4. Social Accounts Table
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'website')),
  username TEXT,
  url TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_profile_platform UNIQUE(profile_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_social_accounts_profile 
  ON public.social_accounts(profile_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Categories
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
CREATE POLICY "Categories are readable by everyone"
  ON public.categories FOR SELECT
  USING (TRUE);

-- 7. RLS Policies for Profile Categories
DROP POLICY IF EXISTS "Profile categories readable by everyone" ON public.profile_categories;
CREATE POLICY "Profile categories readable by everyone"
  ON public.profile_categories FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Users can manage own profile categories" ON public.profile_categories;
CREATE POLICY "Users can manage own profile categories"
  ON public.profile_categories FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- 8. RLS Policies for Social Accounts
DROP POLICY IF EXISTS "Public social accounts are viewable by everyone" ON public.social_accounts;
CREATE POLICY "Public social accounts are viewable by everyone"
  ON public.social_accounts FOR SELECT
  USING (is_public = TRUE OR auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert own social accounts" ON public.social_accounts;
CREATE POLICY "Users can insert own social accounts"
  ON public.social_accounts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update own social accounts" ON public.social_accounts;
CREATE POLICY "Users can update own social accounts"
  ON public.social_accounts FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete own social accounts" ON public.social_accounts;
CREATE POLICY "Users can delete own social accounts"
  ON public.social_accounts FOR DELETE
  USING (auth.uid() = profile_id);

-- 9. Supabase Storage Setup for Avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies (avatars)
DROP POLICY IF EXISTS "Public avatars can be viewed by anyone" ON storage.objects;
CREATE POLICY "Public avatars can be viewed by anyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Authenticated users can delete own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
