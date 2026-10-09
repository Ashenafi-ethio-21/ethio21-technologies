/**
 * Ethio 21 Technologies - Service Worker
 * Fast caching, offline resilience, and Network-First navigation for instantaneous updates
 */

const CACHE_NAME = 'ethio21-v200-instant-auto-refresh-2026';
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
  './assets/teme_astegni_192.png',
  './assets/teme_astegni_512.png',
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
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url).catch((err) => console.warn('[SW] Caching skipped for', url, err)))
      );
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
    }).then(() => self.clients.claim()).then(() => {
      // Force all open tabs running older versions to immediately reload the brand-new app!
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          try {
            client.postMessage({ action: 'FORCE_UPDATE_RELOAD', cache: CACHE_NAME });
            client.navigate(client.url);
          } catch (e) {}
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Navigation requests (HTML files) - NETWORK-FIRST WITH FORCED RELOAD!
  // Ensures any user with a link from days before gets the latest version immediately!
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request, { cache: 'reload' })
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
