/**
 * Environment configuration
 * Uses Vite's env system: https://vitejs.dev/guide/env-and-mode.html
 */

export const env = {
  // API base URL - empty for dev (static JSON), set for prod
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

  // Site name
  SITE_NAME: import.meta.env.VITE_SITE_NAME || 'Jump-1',

  // Contact links
  LINE_URL: import.meta.env.VITE_LINE_URL || '',
  FACEBOOK_URL: import.meta.env.VITE_FACEBOOK_URL || '',
  INSTAGRAM_URL: import.meta.env.VITE_INSTAGRAM_URL || '',

  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

// Type-safe access
export type Env = typeof env;
