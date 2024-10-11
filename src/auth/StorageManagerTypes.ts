export class CustomStorageError extends Error {
  code: 'storage/unauthorized'
  | 'storage/server-error'
  | 'storage/retry-limit-exceeded';

  constructor(error?: 'storage/unauthorized' | 'storage/retry-limit-exceeded') {
    super();
    this.code = error || 'storage/server-error';
  }
}

export type UploadUserDisplayPicture = (
  uid: string,
  blob: Blob,
) => Promise<string>;

export type DeleteUserDisplayPicture = (uid: string, photoURL: string) => Promise<void>;

export type DeleteUserData = (uid: string) => Promise<void>;
