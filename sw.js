// Service Worker for Da Nang Trip Page
// Caches essential assets for offline use
const CACHE_NAME = 'danang-trip-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// Cache-first strategy for static assets
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/,
  /\.(?:css|js|woff2?)$/,
  /fonts\.(?:googleapis|gstatic)\.com/,
  /unpkg\.com/,
];

// Network-first strategy for HTML pages
const NETWORK_FIRST_PATTERNS = [
  /\.html$/,
  /\/$/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Check if cache-first
  const isCacheFirst = CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname) || pattern.test(url.href));
  // Check if network-first
  const isNetworkFirst = NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname));

  if (isCacheFirst) {
    // Cache-first: return cached version first, update cache in background
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
  } else if (isNetworkFirst) {
    // Network-first: try network, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Default: network-first for everything else
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
