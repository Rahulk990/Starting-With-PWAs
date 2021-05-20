
// Install Event
self.addEventListener('install', (event) => {
    // console.log('[SW] Installing Service Worker: ', event)

    /*
        Pre-Caching Data
    */

    // This is same as await
    event.waitUntil(
        caches.open('Pre-Cache')
            .then((cache) => {
                console.log('[SW] Pre-Caching App Shell')

                // Adding Files to Cache
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ])
            })
    )

})

// Activate Event
self.addEventListener('activate', (event) => {
    // console.log('[SW] Activating Service Worker: ', event)
    return self.clients.claim();
})


/*
    Non-Lifecycle Events
*/

// Basic Fetch Event
self.addEventListener('fetch', (event) => {
    // console.log('[SW] Fetch Event: ', event)

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
    )
})






