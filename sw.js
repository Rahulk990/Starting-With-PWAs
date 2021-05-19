
// Install Event
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker: ', event)

    /*
        Pre-Caching Data
    */

    // This is same as await
    event.waitUntil(
        caches.open('Pre-Cache')
            .then((cache) => {
                console.log('[SW] Pre-Caching Files: ', cache)

                // Adding Files to Cache
                cache.add('/src/js/app.js')
                cache.add('/index.html')

            })
    )

})

// Activate Event
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker: ', event)
    return self.clients.claim();
})


/*
    Non-Lifecycle Events
*/

// Basic Fetch Event
// self.addEventListener('fetch', (event) => {
//     console.log('[SW] Fetch Event: ', event)
// })






