// --- VOLVEMOS a la versión del caché v6 ---
const CACHE_NAME = 'radio-pwa-cache-v6';

// Archivos para guardar en caché
const urlsToCache = [
  '.', // Esto cachea el index.html
  'index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Evento 'install': se dispara cuando el SW se instala
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v6 abierto');
        // Usamos addAll simple
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Forzar activación
  );
});

// Evento 'fetch': Cache First, luego Network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('Fetch fallido:', error);
        });
      }
    )
  );
});

// Evento 'activate': Limpieza de cachés viejos y tomar control
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; 
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Borrando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control
  );
});