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

/*
    Asynchronous Tasks
*/

// // Async Tasks using Callbacks
// setTimeout(() => {
//     console.log("Outer")
//     setTimeout(() => {
//         console.log("Inner")
//     }, 2000);
// }, 2000);


// // Using Promise
// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("This is the returned value");
//         // reject("This is the error message");
//     }, 2000)
// });

// promise.then((value) => {
//     return value + " Handled";
// }).then((value) => {
//     console.log(value)
// }).catch((err) => {
//     console.log(err)
// })


// // Using Fetch
// fetch('https://httpbin.org/ip')
//     .then(res => {
//         console.log(res)
//         return res.json();
//     })
//     .then(data => {
//         console.log(data)
//     })

// fetch('https://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ message: "This is the post data" })
// })
//     .then(res => {
//         console.log(res)
//         return res.json();
//     })
//     .then(data => {
//         console.log(data)
//     })


