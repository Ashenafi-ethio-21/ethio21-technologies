/**
 * Ethio 21 Technologies - Service Worker
 * Fast caching, offline resilience, and Network-First navigation for instantaneous updates
 */

const CACHE_NAME = 'ethio21-v132-modern-pipeline-infographic';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './teme-exam-app.html',
  './teme-astegni.html',
  './teme-admin.html',
  './architecture_blueprint.html',
  './teme_astegni_master_architecture.html',
  './assets/exam_data.json',
  './assets/teme_astegni_logo.jpg',
  './styles/main.css',
  './scripts/translations.js',
  './scripts/app.js',
  './manifest.json',
  './manifest-teme.json'
];

self.addEventListener('install', (event) => {
  // Activate new SW version immediately without waiting for existing tabs to close
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Purge all legacy caches so stale files are never served
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Navigation requests (HTML files) - NETWORK-FIRST!
  // Ensures all users and their shared links get the latest deployed version instantly!
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If completely offline, fall back to cached version
          return caches.match(request).then((cached) => {
            return cached || caches.match('./teme-astegni.html') || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, images, JSON) - STALE-WHILE-REVALIDATE
  // Serve fast from cache, while updating the cache in the background for next view
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      }).catch(() => {
        // Offline - ignore network error for non-critical assets
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Allow client pages to trigger immediate update and takeover
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
