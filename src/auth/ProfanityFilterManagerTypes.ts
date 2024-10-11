export class ProfanityFilterError extends Error {
  code: 'profanity-filter/nsfw-name' | 'profanity-filter/nsfw-image';

  constructor(error: 'profanity-filter/nsfw-name' | 'profanity-filter/nsfw-image') {
    super();
    this.code = error;
  }
}

export type LocalNameProfanityFilter = (stringToTest?: string) => boolean;

export type ApiNameProfanityFilter = (
  stringToTest: string,
  enableFilter?: boolean,
) => Promise<void>;

export type ImageProfanityFilter = (blob: Blob, enableFilter?: boolean) => Promise<void>;
