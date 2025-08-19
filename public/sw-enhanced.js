/**
 * Enhanced Service Worker for ThemeBotPark
 * Provides offline functionality, caching strategies, and performance optimization
 */

// Removed unused CACHE_NAME to fix ESLint error
// Removed unused CACHE_NAME to fix ESLint error
const STATIC_CACHE = 'themebotpark-static-v2.0.0';
const DYNAMIC_CACHE = 'themebotpark-dynamic-v2.0.0';
const API_CACHE = 'themebotpark-api-v2.0.0';

// Removed unused CACHE_STRATEGIES to fix ESLint error
// Removed unused CACHE_STRATEGIES to fix ESLint error

// Resources to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const CACHE_API_PATTERNS = [
  /^https:\/\/api\./,
  /\/api\//
];

// Resources that should never be cached
const NO_CACHE_PATTERNS = [
  /\/api\/auth/,
  /\/api\/payment/,
  /\/api\/stripe/,
  /\.(mp4|webm|ogg)$/
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(STATIC_ASSETS);
        console.log('Static assets cached successfully');
        
        // Skip waiting to activate immediately
  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
      } catch (error) {
        console.error('Failed to cache static assets:', error);
      }
    })()
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter(cacheName => 
          cacheName.includes('themebotpark') && 
          ![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)
        );
        
        await Promise.all(
          cachesToDelete.map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        
        // Take control of all pages immediately
  // eslint-disable-next-line no-restricted-globals
  self.clients.claim();
        console.log('Service Worker activated successfully');
      } catch (error) {
        console.error('Error during activation:', error);
      }
    })()
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension:')) {
    return;
  }
  
  // Skip if matches no-cache patterns
  if (NO_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Enhanced request handler with fallbacks
async function handleRequest(request) {
  // url variable removed as it was unused (ESLint fix)
  
  try {
    // Determine cache strategy based on resource type
    if (isStaticAsset(request)) {
      return await cacheFirst(request, STATIC_CACHE);
    } else if (isApiCall(request)) {
      return await networkFirst(request, API_CACHE);
    } else {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
  } catch (error) {
    console.error('Error handling request:', request.url, error);
    return await handleFallback(request);
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background if resource is older than 1 hour
    const cacheDate = new Date(cachedResponse.headers.get('date') || Date.now());
    const isOld = (Date.now() - cacheDate.getTime()) > 60 * 60 * 1000;
    
    if (isOld) {
      updateCacheInBackground(request, cache);
    }
    
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    // Clone and cache the response
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
  }
  
  return networkResponse;
}

// Network-first strategy (for dynamic content and APIs)
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    // Try network first
    const networkResponse = await fetch(request.clone(), {
      timeout: 5000 // 5 second timeout
    });
    
    if (networkResponse.ok) {
      // Cache successful responses (except auth and payment APIs)
      if (!NO_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
        const responseClone = networkResponse.clone();
        await cache.put(request, responseClone);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add header to indicate cached response
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-By', 'ServiceWorker-Cache');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      });
    }
    
    throw error;
  }
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse);
      console.log('Cache updated in background for:', request.url);
    }
  } catch (error) {
    console.log('Background cache update failed:', request.url, error);
  }
}

// Fallback handler for when both network and cache fail
async function handleFallback(request) {
  // url variable removed as it was unused (ESLint fix)
  
  // For HTML pages, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await getOfflinePage();
    if (offlineResponse) return offlineResponse;
  }
  
  // For API calls, return informative error
  if (isApiCall(request)) {
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature is not available offline. Please check your connection and try again.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
          'X-Served-By': 'ServiceWorker-Fallback'
        }
      }
    );
  }
  
  // For images, return placeholder
  if (request.headers.get('accept')?.includes('image')) {
    return getImagePlaceholder();
  }
  
  // Generic fallback
  return new Response('Content not available offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Get offline page
async function getOfflinePage() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    return await cache.match('/');
  } catch (error) {
    console.error('Could not get offline page:', error);
    
    // Create minimal offline page
    const offlineHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>ThemeBotPark - Offline</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f8f9fa;
              color: #202124;
            }
            .offline-container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 400px;
            }
            .offline-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #4a9eff;
              margin-bottom: 1rem;
            }
            .retry-button {
              background: #4a9eff;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">🔄</div>
            <h1>You're Offline</h1>
            <p>ThemeBotPark is currently unavailable. Please check your internet connection and try again.</p>
            <button class="retry-button" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </body>
      </html>
    `;
    
    return new Response(offlineHTML, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Get image placeholder
function getImagePlaceholder() {
  // Simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#9aa0a6" 
            text-anchor="middle" dy="0.3em">Image unavailable offline</text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// Utility functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/i.test(url.pathname);
}

function isApiCall(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         CACHE_API_PATTERNS.some(pattern => pattern.test(request.url));
}

// Background sync for API calls (if supported)
// eslint-disable-next-line no-restricted-globals
if ('sync' in self.registration) {
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('sync', (event) => {
    if (event.tag === 'api-sync') {
      event.waitUntil(syncApiCalls());
    }
  });
}

async function syncApiCalls() {
  try {
    console.log('Syncing API calls...');
    // This would integrate with the request queue from apiUtils
    // Send a message to the main thread to process queued requests
  // eslint-disable-next-line no-restricted-globals
  const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_API_CALLS',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Error syncing API calls:', error);
  }
}

// Handle messages from main thread
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      if (Array.isArray(payload)) {
        cacheUrls(payload);
      }
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('URLs cached successfully:', urls);
  } catch (error) {
    console.error('Failed to cache URLs:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name.includes('themebotpark'))
        .map(name => caches.delete(name))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

console.log('Enhanced Service Worker loaded successfully');