let deferredPrompt;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log("Registration Finished"))
}


// Custom Handling the Install Banner
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    console.log("Banner not Prompted")
    deferredPrompt = event;
    return false;
})
