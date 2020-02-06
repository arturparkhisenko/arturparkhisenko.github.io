const cacheName = '20200205-1.0.0';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache =>
        cache
          .addAll([
            '/',
            '/images/dino_js.svg',
            '/styles/main.min.css',
            '/scripts/main.min.js',
            '/site.webmanifest'
          ])
          .then(() => self.skipWaiting())
      )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      // Cleanup old caches
      .then(savedCacheNames =>
        Promise.all(
          savedCacheNames.map(savedCacheName => {
            if (cacheName !== savedCacheName) {
              return caches.delete(savedCacheName);
            }
          })
        )
      )
      // Command SW to take effect immediately on any open pages in scope
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
