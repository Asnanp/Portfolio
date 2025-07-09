// Service Worker for AsnanP Portfolio
// Provides caching and offline functionality

const CACHE_NAME = 'asnanp-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/image.jpg',
  '/image0.webp',
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

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache failed:', error);
        // Don't fail completely if some resources can't be cached
        return Promise.resolve();
      })
  );
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

// Background sync for analytics (if needed)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Placeholder for background sync functionality
  return Promise.resolve();
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/2.jpg',
    badge: '/2.jpg'
  };

  event.waitUntil(
    self.registration.showNotification('AsnanP Portfolio', options)
  );
});
