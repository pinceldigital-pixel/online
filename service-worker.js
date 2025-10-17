// Simple cache for app shell
const CACHE='radio-mockup-fresh';
const FILES=['./','./index.html','./manifest.json','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(FILES.includes('./'+u.pathname.split('/').pop())){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));}});
