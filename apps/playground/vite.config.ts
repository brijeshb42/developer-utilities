// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, splitVendorChunkPlugin } from "vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [splitVendorChunkPlugin(), react()],
});
