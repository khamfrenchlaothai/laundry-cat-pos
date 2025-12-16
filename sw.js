const CACHE_NAME = 'laundry-cat-v3';
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './manifest.json',
    './assets/css/styles.css',
    './assets/js/database.js',
    './assets/js/auth.js',
    './assets/js/components.js',
    './assets/js/app.js',
    './assets/images/logo.jpeg'
];
// Install event - cache resources
self.addEventListener('install', event => {
    // Force new service worker to activate immediately
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Opened cache v3');
                return cache.addAll(urlsToCache);
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
                return fetch(event.request);
            })
    );
});
// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the new service worker takes control immediately
    return self.clients.claim();
});
