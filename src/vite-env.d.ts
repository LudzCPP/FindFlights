/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string                // 'false' to enable live Amadeus calls
  readonly VITE_AMADEUS_CLIENT_ID: string       // from developers.amadeus.com
  readonly VITE_AMADEUS_CLIENT_SECRET: string   // from developers.amadeus.com
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
