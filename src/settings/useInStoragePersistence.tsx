import { useState } from 'react';
import { SettingsType, UsePersistence } from './SettingsTypes';

const initSettings: SettingsType = {};

const useInStoragePersistence: UsePersistence = () => {
  const [toggle, setToggle] = useState(false);
  const refresh = () => setToggle(!toggle);
  const setSettings = (settings: SettingsType) => {
    const settingsString = JSON.stringify(settings);
    window.localStorage.setItem('settings', settingsString);
    refresh();
  };
  const getSettings = () => {
    const settings = window.localStorage.getItem('settings');
    if (typeof settings === 'string') {
      try {
        const settingsObject: SettingsType = JSON.parse(settings);
        return settingsObject;
      } catch {
        return initSettings;
      }
    }
    return initSettings;
  };
  return ({
    isPersistent: true, getSettings, setSettings,
  });
};

export default useInStoragePersistence;
