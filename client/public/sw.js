// public/sw.js
const CACHE_NAME = "my-site-cache-v1";

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) requests (like chrome-extension://)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      }),
    ),
  );
});
