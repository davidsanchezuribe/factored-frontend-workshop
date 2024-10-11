import { ZodSchema } from 'zod';

export const filterUndefined = (array: any[]) => {
  const isDefined = <T>(x: T | undefined): x is T => x !== undefined;
  return array.filter(isDefined);
};

export const pushReturn = <T>(array: T[], item: T) => {
  array.push(item);
  return array;
};

export const customFetch = <T>(
  url: string,
  method: 'GET' | 'POST' = 'POST',
  bodyObject?: Object | ([string, string] | [string, Blob, string])[],
  zodSchema?: ZodSchema<T>,
  apiKey?: string,
) => {
  const isArray = bodyObject !== undefined && 'length' in bodyObject;
  const body = isArray
    ? bodyObject.reduce((acum, value) => {
      if (value[1] instanceof Blob) {
        acum.append(value[0], value[1], value[2]);
      } else {
        acum.append(value[0], value[1]);
      }
      return acum;
    }, new FormData())
    : JSON.stringify(bodyObject);
  const headers = new Headers();
  if (apiKey) headers.append('Authorization', `Bearer ${apiKey}`);
  if (typeof body === 'string') headers.append('Content-Type', 'application/json');
  return fetch(url, { method, headers, body })
    .then((response) => response.json())
    .then((result) => {
      if (zodSchema) zodSchema.parse(result);
      return result as T;
    });
};

export const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (typeof userAgent !== 'string') return 'web';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';
  return 'web';
};

const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

export const maskText = (text: string, begin: number = 3) => {
  let maskedText = text;
  for (let i = begin; i < text.length - 4; i += 1) {
    maskedText = setCharAt(maskedText, i, '*');
  }
  return maskedText;
};

export const getRootPath = () => {
  const { origin } = window.location;
  const { SUBDOMAIN } = process.env;
  return SUBDOMAIN === '' || origin.includes(`${SUBDOMAIN}.`)
    ? origin : `${origin}/${SUBDOMAIN}`;
};
