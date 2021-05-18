
// Install Event
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker: ', event)
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

