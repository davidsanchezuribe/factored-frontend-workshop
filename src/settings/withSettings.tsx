import React, { createContext, useContext, useMemo } from 'react';
import { SettingsContextType } from './SettingsTypes';
import getSettingsContextValue from './getSettingsContextValue';
import getPersistence from './usePersistence';

export const InitSettingContext: SettingsContextType = {
  isPersistent: false,
  getRawCookies: () => '',
  eraseCookies: () => {},
  useStringNullableSetting: () => [undefined, () => {}, () => {}],
  useStringSetting: () => ['', () => {}, () => {}],
  useNumberSetting: () => [0, () => {}, () => {}],
  useBooleanSetting: () => [undefined, () => {}, () => {}],
  useObjectSetting: (key: string, initArg) => [initArg, () => {}, () => {}],
};

const SettingsContext = createContext<SettingsContextType>(InitSettingContext);

const withSettings = (BaseApp: React.ComponentType) => () => {
  const persistence = getPersistence();
  const { isPersistent, getSettings, setSettings } = persistence;
  const value = getSettingsContextValue(isPersistent, getSettings, setSettings);
  return (
    <SettingsContext.Provider value={useMemo(() => value, [persistence])}>
      <BaseApp />
    </SettingsContext.Provider>
  );
};

export const useSetting = () => useContext(SettingsContext);

export default withSettings;
