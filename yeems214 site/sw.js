// Service Worker for yeems214.xyz - Performance Optimization
const CACHE_NAME = 'yeems214-v1.2';
const OFFLINE_CACHE = 'yeems214-offline-v1';

// Define what to cache
const CACHE_URLS = [
    '/',
    '/index.html',
    '/assets/css/apple-style.css',
    '/assets/css/videobanner.css',
    '/assets/bootstrap/css/bootstrap.min.css',
    '/assets/js/stylish-portfolio.js',
    '/assets/bootstrap/js/bootstrap.bundle.min.js',
    '/assets/fonts/font-awesome.min.css',
    '/assets/fonts/simple-line-icons.min.css',
    // Core images - only cache optimized versions
    '/assets/img/abarca_dim.jpg',
    '/assets/img/resized_memoji2.png'
];

// Network-first strategy URLs (always try network first)
const NETWORK_FIRST_URLS = [
    '/api/',
    '.mp4'
];

// Cache-first strategy URLs (serve from cache if available)
const CACHE_FIRST_URLS = [
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.ico'
];

// Install event - cache core resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching core resources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Network-first strategy for API calls and videos
    if (NETWORK_FIRST_URLS.some(pattern => request.url.includes(pattern))) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-first strategy for static assets
    if (CACHE_FIRST_URLS.some(pattern => request.url.includes(pattern))) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Stale-while-revalidate for images
    if (request.destination === 'image') {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // Default: Network-first with fallback
    event.respondWith(networkFirstWithFallback(request));
});

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        return caches.match(request);
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Both cache and network failed:', error);
        throw error;
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Fetch in background to update cache
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, but we might have cached version
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return fetchPromise;
}

// Network-first with offline fallback
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Background sync for performance metrics
self.addEventListener('sync', event => {
    if (event.tag === 'performance-metrics') {
        event.waitUntil(sendPerformanceMetrics());
    }
});

// Send performance metrics (optional)
async function sendPerformanceMetrics() {
    // This could send metrics to your analytics service
    console.log('Syncing performance metrics');
} 