/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_GIT_COMMIT_SHA: string;
  // more env variables...
}

interface Window {
  shouldHydrate: boolean;
}
