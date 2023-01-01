/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_GIT_COMMIT_SHA: string;
  // more env variables...
}

declare module "*.wasm?url" {
  const src: string;
  export default src;
}
