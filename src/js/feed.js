var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const locationInput = document.querySelector('#location');

function openCreatePostModal() {
    createPostArea.style.transform = 'translateY(0)';
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => console.log(choice))
        deferredPrompt = null;
    }
}

function closeCreatePostModal() {
    createPostArea.style.transform = 'translateY(100vh)';
}

shareImageButton.addEventListener('click', openCreatePostModal);
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// const onSaveButtonClicked = (event) => {
//   console.log('Button clicked') 

//   // On-Demand Caching
//   if ('caches' in window) {
//     caches.open('On-Demand-Cache')
//       .then((cache) => {
//         cache.add('https://httpbin.org/get');
//         cache.add('/src/images/sf-boat.jpg');
//       });
//   }
// }

const clearCards = () => {
    while (sharedMomentsArea.hasChildNodes()) {
        sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
    }
}

function createCard(data) {
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    cardTitle.style.backgroundImage = 'url(' + data.image + ')';
    cardTitle.style.backgroundSize = 'cover';
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.style.color = 'white';
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = data.title;
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = data.location;
    cardSupportingText.style.textAlign = 'center';
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent = 'Save';
    // cardSaveButton.addEventListener('click', onSaveButtonClicked);
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
    clearCards();
    for (var i = 0; i < data.length; i++) {
        createCard(data[i]);
    }
}


/*
  Cache, then Network Strategy
*/

const url = 'https://pwa-demo-3a456-default-rtdb.firebaseio.com/posts.json';
let networkDataReturned = false;

// From Network
fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        networkDataReturned = true;
        console.log("From Network", data)

        let dataArray = [];
        for (let key in data) {
            dataArray.push(data[key]);
        }

        // Override with updated data
        updateUI(dataArray);
    });

// From Cache
if ('indexedDB' in window) {
    readAllData('posts')
        .then((data) => {

            // Override if not already updated
            if (data && !networkDataReturned) {
                console.log('From IndexedDB', data);
                updateUI(data);
            }
        })
}

// Sending Data to Firebase
const sendData = (data) => {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            console.log('Sent Data:', res);
            updateUI();
        })
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Validating inputs
    if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
        return;
    }
    closeCreatePostModal();

    // Accessing SW as form data is not available in SW
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
            .then((sw) => {

                // Adding Data to IDB
                const postData = {
                    id: new Date().toISOString(),
                    title: titleInput.value,
                    location: locationInput.value
                }

                writeData('sync', postData)
                    .then(() => {

                        // Registering Sync Task
                        return sw.sync.register('sync-new-post');
                    })
                    .then(() => {
                        const snackbar = document.querySelector('#confirmation-toast');
                        const data = { message: "Your post has been saved for Synchronization!" }
                        snackbar.MaterialSnackbar.showSnackbar(data);
                    })
            })
    }
    else {

        // Sending Post Request
        sendData({
            id: new Date().toISOString(),
            title: titleInput.value,
            location: locationInput.value,
            image: "https://firebasestorage.googleapis.com/v0/b/pwa-demo-3a456.appspot.com/o/sf-boat.jpg?alt=media&token=5b0beeaa-5a7a-43ec-bb65-485361de0aa3"
        })
    }
})




