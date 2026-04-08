const cacheName = "travel-app-v1";
const filesToCache = [
  "index.html",
  "style.css",
  "script.js",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;

      return fetch(e.request).catch(err => {
        console.log("Fetch failed:", err);

        
        if (e.request.destination === "image") {
          return new Response(
            "",
            { status: 404 }
          );
        }
      });
    })
  );
});