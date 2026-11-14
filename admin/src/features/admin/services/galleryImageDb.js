const DATABASE_NAME = 'shs_campus_gallery';
const DATABASE_VERSION = 1;
const STORE_NAME = 'galleryRecords';

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Unable to open gallery storage.'));
  request.onblocked = () => reject(new Error('Gallery storage is currently blocked.'));
});

const runTransaction = async (mode, operation) => {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    let result;

    try {
      result = operation(store);
    } catch (error) {
      database.close();
      reject(error);
      return;
    }

    transaction.oncomplete = () => {
      database.close();
      resolve(result?.result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Gallery storage operation failed.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Gallery storage operation was interrupted.'));
    };
  });
};

export const getGalleryImageRecords = () => runTransaction(
  'readonly',
  (store) => store.getAll()
);

export const saveGalleryImageRecord = (record) => runTransaction(
  'readwrite',
  (store) => store.put(record)
);

export const deleteGalleryImageRecord = (id) => runTransaction(
  'readwrite',
  (store) => store.delete(id)
);

export const saveDeletedDemoImage = (demoId) => runTransaction(
  'readwrite',
  (store) => store.put({
    id: `deleted-demo:${demoId}`,
    kind: 'deleted-demo',
    demoId,
  })
);
