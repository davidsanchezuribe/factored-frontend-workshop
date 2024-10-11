import { useState } from 'react';
import { SettingsType, UsePersistence } from './SettingsTypes';

const initSettings: SettingsType = {};

const useInMemoryPersistence: UsePersistence = () => {
  const [settings, setSettings] = useState<SettingsType>(initSettings);
  const getSettings = () => settings;
  return ({
    isPersistent: false, getSettings, setSettings,
  });
};

export default useInMemoryPersistence;
