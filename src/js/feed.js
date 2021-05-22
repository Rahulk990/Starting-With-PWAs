var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
    createPostArea.style.display = 'block';
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => console.log(choice))
        deferredPrompt = null;
    }
}

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
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
    cardTitle.style.height = '180px';
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
if ('caches' in window) {
    caches.match(url)
        .then(function (response) {
            if (response) {
                return response.json();
            }
        })
        .then(function (data) {
            console.log('From Cache', data);

            // Override if not already updated
            if (data && !networkDataReturned) {
                let dataArray = [];
                for (let key in data) {
                    dataArray.push(data[key]);
                }
                updateUI(dataArray);
            }
        });
}


