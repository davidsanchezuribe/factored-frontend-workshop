import {
  StorageError,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  CustomStorageError, DeleteUserDisplayPicture, UploadUserDisplayPicture,
} from './StorageManagerTypes';

export const uploadUserDisplayPicture: UploadUserDisplayPicture = (
  uid: string,
  blob: Blob,
) => {
  const storage = getStorage();
  storage.maxUploadRetryTime = 3000;
  const storageRef = ref(storage, `${uid}/public/avatar.jpeg`);
  return uploadBytes(storageRef, blob)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .catch((error: StorageError | CustomStorageError) => {
      console.log(error.code);
      if (error.code === 'storage/unauthorized' || error.code === 'storage/retry-limit-exceeded') {
        throw new CustomStorageError(error.code);
      }
      throw new CustomStorageError();
    });
};

export const deleteUserDisplayPicture: DeleteUserDisplayPicture = (
  uid: string,
  photoURL: string,
) => {
  if (!photoURL.includes(uid)) {
    return Promise.resolve();
  }
  const storage = getStorage();
  const photoRef = ref(storage, `${uid}/public/avatar.jpeg`);
  return deleteObject(photoRef)
    .then(() => {})
    .catch((error: StorageError) => {
      console.log(error.code);
      if (error.code !== 'storage/object-not-found' && error.code !== 'storage/unauthorized') {
        throw new CustomStorageError();
      } else {
        return undefined;
      }
    });
};
