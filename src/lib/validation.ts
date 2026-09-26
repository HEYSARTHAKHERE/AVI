/**
 * Validation and normalization utilities for Phase 3 Onboarding
 */

export function normalizeSocialUrl(
  platform: 'instagram' | 'youtube' | 'tiktok' | 'website',
  input: string
): { valid: boolean; normalizedUrl: string; username?: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: true, normalizedUrl: '', username: '' };
  }

  try {
    if (platform === 'instagram') {
      const clean = trimmed.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
      if (!/^[a-zA-Z0-9._]{1,30}$/.test(clean)) {
        return { valid: false, normalizedUrl: '', error: 'Invalid Instagram handle' };
      }
      return { valid: true, normalizedUrl: `https://instagram.com/${clean}`, username: clean };
    }

    if (platform === 'tiktok') {
      const clean = trimmed.replace(/^@/, '').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '').replace(/\/$/, '');
      if (!/^[a-zA-Z0-9._]{1,30}$/.test(clean)) {
        return { valid: false, normalizedUrl: '', error: 'Invalid TikTok username' };
      }
      return { valid: true, normalizedUrl: `https://tiktok.com/@${clean}`, username: clean };
    }

    if (platform === 'youtube') {
      let clean = trimmed.replace(/^https?:\/\/(www\.)?youtube\.com\//, '').replace(/\/$/, '');
      if (clean.startsWith('@')) clean = clean.substring(1);
      if (!clean) {
        return { valid: false, normalizedUrl: '', error: 'Invalid YouTube URL or handle' };
      }
      return { valid: true, normalizedUrl: `https://youtube.com/@${clean}`, username: clean };
    }

    if (platform === 'website') {
      let urlWithScheme = trimmed;
      if (!/^https?:\/\//i.test(trimmed)) {
        urlWithScheme = `https://${trimmed}`;
      }
      const parsed = new URL(urlWithScheme);
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return { valid: false, normalizedUrl: '', error: 'Please enter a valid website domain' };
      }
      return { valid: true, normalizedUrl: urlWithScheme, username: parsed.hostname };
    }

    return { valid: true, normalizedUrl: trimmed };
  } catch {
    return { valid: false, normalizedUrl: '', error: 'Invalid URL format' };
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Please upload a JPG, PNG, or WEBP image format.',
    };
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: 'Image must be under 5MB in size.',
    };
  }

  return { valid: true };
}
