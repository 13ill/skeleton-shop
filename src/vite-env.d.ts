/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SITE_NAME: string
  readonly VITE_LINE_URL: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
