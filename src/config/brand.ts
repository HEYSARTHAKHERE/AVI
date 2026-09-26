/** Central MAVORA identity and deployment defaults. Keep environment-specific
 * values here so copy, metadata, and public URLs do not drift across screens. */
export const brand = {
  name: 'MAVORA',
  tagline: 'Create Together. Grow Everywhere.',
  description:
    'One platform for creators and brands to discover opportunities, build partnerships, manage campaigns, and measure real results.',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'hello@mavora.example',
  social: {
    instagram: '',
    linkedin: '',
    x: '',
  },
} as const;

export const brandMark = {
  viewBox: '0 0 32 32',
  path: 'M4 24V8l7.2 11.7L16 8l4.8 11.7L28 8v16h-4V16.8l-5.7 10.6h-4.6L8 16.8V24H4Z',
} as const;
