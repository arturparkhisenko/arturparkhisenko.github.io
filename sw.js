const cacheName = '20190129-1.0.0';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([
      '/',
      '/images/dino_js.svg',
      '/styles/main.min.css',
      '/scripts/main.min.js',
      '/site.webmanifest'
    ]).then(() => self.skipWaiting()))
  );
});

self.addEventListener('activate', (event) => {
  /**
   * onActivate
   * @return {object} - promise
   */
  function onActivate() {
    // cleanup old caches
    return caches.keys().then((savedCacheNames) => {
      return Promise.all(
        savedCacheNames.map((savedCacheName) => {
          if (cacheName !== savedCacheName) {
            return caches.delete(savedCacheName);
          }
        })
      );
    });
  }
  event.waitUntil(
    onActivate()
    // This makes the SW take effect immediately
    // on any open pages in scope
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
