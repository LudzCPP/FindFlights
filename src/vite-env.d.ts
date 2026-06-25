/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string               // 'false' to enable live API calls
  readonly VITE_TRAVELPAYOUTS_TOKEN: string    // from travelpayouts.com/developer/api

  // Kept for reference — Amadeus not currently used
  readonly VITE_AMADEUS_CLIENT_ID: string
  readonly VITE_AMADEUS_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
