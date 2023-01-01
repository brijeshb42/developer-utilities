// eslint-disable-next-line import/no-unresolved
import wasmUrl from "lightningcss-wasm/lightningcss_node_bg.wasm?url";

export const wasmLoader = () => import("lightningcss-wasm");

let wasmPromise: Promise<typeof import("lightningcss-wasm")>;
let initPromise: Promise<void>;

export async function loadLightningWasm() {
  if (!wasmPromise) {
    wasmPromise = wasmLoader();
  }
  const module = await wasmPromise;
  if (!initPromise) {
    initPromise = module.default(new URL(wasmUrl, import.meta.url));
  }
  await initPromise;
  return module;
}
