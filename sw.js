/* KretStop Kalkulator dojazdu — service worker */
var CACHE = 'kretstop-dojazd-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.webp',
  './maskotka.webp',
  './favicon-16.png',
  './favicon-32.png',
  './favicon-48.png',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './fonts/fonts.css',
  './fonts/PlayfairDisplay-500.woff2',
  './fonts/PlayfairDisplay-500i.woff2',
  './fonts/PlayfairDisplay-700.woff2',
  './fonts/SourceSans3-400.woff2',
  './fonts/SourceSans3-600.woff2',
  './fonts/SourceSans3-700.woff2'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Statyczne zasoby: cache-first. Zapytania do Google API: zawsze sieć. */
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        return res;
      });
    })
  );
});
