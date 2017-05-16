const cacheName = '20170505-1.0.0';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/images/dino_js.svg',
      '/styles/main.min.css',
      '/scripts/main.min.js',
      '/manifest.json'
    ]).then(() => self.skipWaiting()))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
