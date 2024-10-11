export const isLocalStorageAvailable = () => {
  const test = 'test';
  try {
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const settingsConsentStatus = 'settings:consent:status';
const settingsConsentDate = 'settings:consent:date';

const getSettingsConsentStatus = () => {
  const status: string | null = window.localStorage.getItem(settingsConsentStatus);
  if (status === 'true') return true;
  if (status === 'false') return false;
  return undefined;
};

const getSettingsConsentDate = () => {
  const date: string | null = window.localStorage.getItem(settingsConsentDate);
  if (typeof date === 'string') {
    const parsedDate = Date.parse(date);
    return Number.isNaN(parsedDate) ? undefined : parsedDate;
  }
  return undefined;
};

const renew = (date: number | undefined) => {
  if (!date) return true;
  const monthsToRenew = 3;
  return +(new Date()) - +date > 1000 * 60 * 60 * 24 * 30 * monthsToRenew;
};

export const getSettingsConsent = () => {
  if (isLocalStorageAvailable()) {
    const date = getSettingsConsentDate();
    if (!renew(date)) return getSettingsConsentStatus();
  }
  return undefined;
};

export const setSettingsConsent = (status: boolean | undefined) => {
  try {
    if (status === false) window.localStorage.removeItem('settings');
    window.localStorage.setItem(settingsConsentStatus, typeof status === 'boolean' ? status.toString() : 'undefined');
    window.localStorage.setItem(settingsConsentDate, (new Date()).toString());
    return true;
  } catch (e) {
    return false;
  }
};
