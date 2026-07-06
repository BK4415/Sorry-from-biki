/* Minimal offline cache. Optional — only helps when the site is served
   over http(s) (e.g. GitHub Pages, Netlify). It has no effect when the
   file is opened directly (file://) and is safe to delete if unused;
   just also remove its registration in js/main.js's registerSW() call
   and the <link rel="manifest"> tag in index.html. */

const CACHE_NAME = "for-ruma-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/main.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
