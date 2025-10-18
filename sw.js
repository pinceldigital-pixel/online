// --- CAMBIO: Actualizamos la versión del caché a v3 ---
const CACHE_NAME = 'radio-pwa-cache-v3';

// Archivos para guardar en caché
const urlsToCache = [
  '.', // Esto cachea el index.html
  'index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
  // Los íconos se cachearán cuando se soliciten
];

// Evento 'install': se dispara cuando el SW se instala
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v3 abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la app pide un recurso
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, lo devuelve del caché
        if (response) {
          return response;
        }
        
        // Si no, va a la red a buscarlo
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': Limpieza de cachés viejos
// Esto se asegura de que la v1 y v2 se eliminen
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Solo queremos que exista el caché v3
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Si el caché no está en nuestra "lista blanca", se borra
            console.log('Borrando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});