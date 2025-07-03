const CACHE_NAME = "my-site-cache-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (
    req.method !== "GET" ||
    !(req.url.startsWith("http://") || req.url.startsWith("https://"))
  ) {
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      fetch(req)
        .then((res) => {
          cache.put(req, res.clone());
          return res;
        })
        .catch(() => cache.match(req)),
    ),
  );
});
