// Initializing the Database
const dbPromise = idb.open('posts-store', 1, (db) => {

    // Creating the Object Store, if not there
    if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('sync')) {
        db.createObjectStore('sync', { keyPath: 'id' });
    }
})

// Writing data to the Object Store
const writeData = (storeName, data) => {
    return dbPromise
        .then((db) => {
            const tx = db.transaction(storeName, 'readwrite')
            const store = tx.objectStore(storeName);
            store.put(data);

            // It is returned to mark the end of transaction and maintain atomicity
            // Required only in case of Writing Data
            return tx.complete;
        })
}

// Reading Data from the Object Store
const readAllData = (storeName) => {
    return dbPromise
        .then((db) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            return store.getAll();
        })
}

// Clearing All Data from the Object Store
const clearAllData = (storeName) => {
    return dbPromise
        .then((db) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.clear();
            return tx.complete;
        })
}

// Deleting one Item from the Object store
const deleteItem = (storeName, key) => {
    return dbPromise
        .then((db) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.delete(key);
            return tx.complete;
        })
}