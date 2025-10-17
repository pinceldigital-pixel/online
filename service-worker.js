// Simple offline cache for shell files
const CACHE = 'radio-minimal-v1';
const FILES = [
  './','./index.html','./manifest.json',
  './assets/icon-192.png','./assets/icon-512.png','./assets/pro-badge.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const {request} = e;
  // Cache-first for app shell; network for streams
  if (FILES.some(f=>new URL(f, location).href===request.url)){
    e.respondWith(caches.match(request).then(r=>r||fetch(request)));
  }
});
