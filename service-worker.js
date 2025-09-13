// Basic offline cache for PWA
const CACHE = 'task-manager-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './styles/style.css',
  './styles/responsive.css',
  './scripts/app.js',
  './scripts/taskManager.js',
  './scripts/utils.js',
  './assets/icons/favicon.svg',
  './assets/icons/favicon.ico',
  './assets/icons/favicon-32x32.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(ASSETS); } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const resp = await fetch(request);
      const copy = resp.clone();
      const cache = await caches.open(CACHE);
      // Avoid caching cross-origin opaque responses aggressively
      if (request.url.startsWith(self.location.origin)) {
        cache.put(request, copy);
      }
      return resp;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
