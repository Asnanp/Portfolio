// Service Worker for AsnanP Portfolio
// Provides caching and offline functionality - Privacy focused version

const CACHE_NAME = 'asnanp-portfolio-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/image.jpg',
  '/image0-placeholder.svg',
  '/2.jpg',
  '/model.glb',
  '/rounded_cube.glb',
  '/donut_2.0.glb',
  '/ufo.glb',
  '/360_sphere_robot_no_glass.glb',
  '/holographic_cube.glb',
  'https://unpkg.com/three@0.152.2/build/three.module.js',
  'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js',
  'https://unpkg.com/three@0.152.2/examples/jsm/loaders/RGBELoader.js'
];

// Install event - cache resources (privacy focused)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache setup failed:', error);
        return Promise.resolve();
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Network fallback
        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Remove background sync and push notification listeners - privacy focused
// No tracking or analytics
