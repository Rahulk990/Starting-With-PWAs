const STATIC_CACHE = 'Pre-Cache-v4'
const DYNAMIC_CACHE = 'Dynamic-Cache-v1'
const ON_DEMAND_CACHE = 'On-Demand-Cache'
const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

// Install Event
self.addEventListener('install', (event) => {
    // console.log('[SW] Installing Service Worker: ', event)

    /*
        Pre-Caching Data
    */

    // This is same as await
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Pre-Caching App Shell')

                // Adding Files to Cache
                cache.addAll(STATIC_FILES)
            })
    )

})

// Activate Event
self.addEventListener('activate', (event) => {
    // console.log('[SW] Activating Service Worker: ', event)

    // Cleaning Older Cache Store
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map(key => {
                    if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== ON_DEMAND_CACHE) {
                        console.log('[SW] Removing Old Cache: ', key)
                        return caches.delete(key)
                    }
                }))
            })
    )

    return self.clients.claim();
})

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) {
        console.log('matched ', string);
        cachePath = string.substring(self.origin.length);
    } else {
        cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}


// Recursively Delete the Oldest Item from the Cache
function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
        .then((cache) => {
            return cache.keys()
                .then((keys) => {
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                    }
                })
        })
}


/*
    Non-Lifecycle Events
*/

// Basic Fetch Event
self.addEventListener('fetch', (event) => {
    // console.log('[SW] Fetch Event: ', event)

    const url = 'https://httpbin.org/get';

    if (event.request.url.indexOf(url) > -1) {

        // Cache, then Network Strategy
        event.respondWith(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return fetch(event.request)
                        .then((response) => {

                            // Dynamically Caching the updated data
                            cache.put(event.request.url, response.clone())
                            return response;
                        })
                })
        )

    } else if (isInArray(event.request.url, STATIC_FILES)) {

        // Cache-only Strategy with Static Files
        event.respondWith(
            caches.match(event.request)
        )

    } else {

        // Cache with Network Fallback Strategy
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    } else {

                        // Dynamically Caching Items
                        return fetch(event.request)
                            .then((response) => {
                                return caches.open(DYNAMIC_CACHE)
                                    .then((cache) => {
                                        console.log('[SW] Dynamically-Caching Items')

                                        // Clone is needed as the response can be consumed only once
                                        cache.put(event.request.url, response.clone())
                                        return response;
                                    })
                            })
                            .catch((error) => {
                                console.log('[SW] Network Error: ', error)

                                // Returning the Fallback Page conditionally
                                if (event.request.headers.get('Accept').includes('text/html')) {
                                    return caches.match('/offline.html');
                                }
                            })
                    }
                })
        )
    }
})


/*
    Caching Strategies
*/

// Cache with Network Fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request);
//         }
//       })
//   );
// });

// Network with Cache Fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });






