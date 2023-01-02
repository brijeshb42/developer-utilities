// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
// eslint-disable-next-line no-undef, @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-undef, no-restricted-globals
const sw = self as ServiceWorkerGlobalScope & {
  assets: string[];
  cacheId: string;
};

sw.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(sw.cacheId).then((cache) => cache.addAll(sw.assets))
  );
});

sw.addEventListener("activate", (ev) => {
  ev.waitUntil(
    (async () => {
      if ("navigationPreload" in sw.registration) {
        await sw.registration.navigationPreload.enable();
      }
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((nm) => nm !== sw.cacheId)
          .map((nm) => caches.delete(nm))
      );
    })()
  );
  sw.clients.claim();
});

sw.addEventListener("fetch", (ev) => {
  if (ev.request.mode !== "navigate") {
    return;
  }
  if (ev.request.method.toLowerCase() !== "get") {
    return;
  }
  ev.respondWith(
    (async () => {
      if (ev.preloadResponse) {
        return ev.preloadResponse;
      }
      const cachedResp = await caches.match(ev.request);
      if (cachedResp) {
        return cachedResp;
      }
      const resp = await fetch(ev.request);
      if (!ev.request.url.startsWith("http")) {
        return resp;
      }
      const cache = await caches.open(sw.cacheId);
      cache.put(ev.request, resp.clone());
      return resp;
    })()
  );
});
