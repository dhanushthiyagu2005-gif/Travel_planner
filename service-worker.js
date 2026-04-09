const cacheName = "travel-app-v2";

const filesToCache = [
  "index.html",
  "home.html",
  "style.css",
  "script.js"
];

self.addEventListener("install", e => {
  self.skipWaiting(); // 🔥 force update
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key); // 🔥 delete old cache
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});