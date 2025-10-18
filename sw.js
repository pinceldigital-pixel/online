// --- CAMBIO: Actualizamos la versión del caché a v7 ---
const CACHE_NAME = 'radio-pwa-cache-v7';

// Archivos para guardar en caché
const urlsToCache = [
  '.', // Esto cachea el index.html
  'index.html',
  // IMPORTANTE: Agrega aquí los archivos de íconos si no están cacheados automáticamente
  // 'icon-192.png', 
  // 'icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Evento 'install': se dispara cuando el SW se instala
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v7 abierto');
        // Usamos addAll con { cache: 'reload' } para forzar la descarga de los archivos frescos
        return Promise.all(
          urlsToCache.map(url => cache.add(new Request(url, { cache: 'reload' })))
        );
      })
      .then(() => {
        // Forzar la activación del nuevo SW inmediatamente
        return self.skipWaiting(); 
      })
  );
});

// Evento 'fetch': Estrategia Cache First, luego Network
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET (ej. POST)
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, lo devuelve del caché
        if (response) {
          return response;
        }
        
        // Si no, va a la red a buscarlo
        return fetch(event.request).then(
          networkResponse => {
            // Opcional: Podrías guardar la respuesta en caché aquí si quisieras
            // cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        ).catch(error => {
          // Manejo de error si falla la red (ej. offline)
          console.error('Fetch fallido; devolviendo offline page o nada.', error);
          // Podrías devolver una página offline básica aquí si la tuvieras cacheada
          // return caches.match('/offline.html'); 
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
    }).then(() => {
        // Tomar control de las páginas abiertas inmediatamente
        return self.clients.claim(); 
    })
  );
});