const CACHE_NAME = 'manos-de-angel-v1'; // Cambié a v2 para forzar actualización

const urlsToCache = [
  './',
  './index.html',
  './carrusel.html',
  './css/styles.css',
  './js/pwa.js', 
  './manifest.webmanifest',

  // TUS IMÁGENES (Asegúrate que existan en la carpeta img)
  './img/logo-manos.webp',
  './img/fondo.webp',
  './img/mancha-fondo.webp',
  './img/1.webp',
  './img/2.webp',
  './img/3.webp',
  './img/4.webp',
  './img/5.webp',
  './img/6.webp',
  './img/7.webp',
  './img/8.webp',
  './img/9.webp',

  // LIBRERÍAS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Montserrat:wght@400;700&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Guardando archivos en caché...');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // 1. FILTRO DE SEGURIDAD: Solo interceptamos peticiones HTTP/HTTPS
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // 2. FILTRO DE TIPO: Solo guardamos en caché peticiones GET
  // (Esto arregla el error rojo de "POST unsupported")
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      if (cachedRes) return cachedRes;

      return fetch(event.request).then(networkRes => {
        // Validamos que la respuesta sea válida antes de guardar
        if (!networkRes || networkRes.status !== 200 || networkRes.type !== 'basic' && networkRes.type !== 'cors') {
          return networkRes;
        }

        const resClone = networkRes.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });

        return networkRes;
      }).catch(() => console.log('Offline y no encontrado en caché:', event.request.url));
    })
  );

});
