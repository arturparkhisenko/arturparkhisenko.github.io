const cacheName = '20160719-0.0.4';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([
      '/',
      '/index.html',
      '/images/dino_js.svg',
      '/styles/main.min.css',
      '/scripts/main.min.js',
      '/manifest.json',
    ]).then(() => self.skipWaiting()))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
