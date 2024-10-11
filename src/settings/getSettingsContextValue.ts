import { GetSettingsContextValue, SettingsType, SettingsTypes } from './SettingsTypes';

const getSettingsContextValue: GetSettingsContextValue = (
  isPersistent: boolean,
  getSettings: () => SettingsType,
  setSettings: (settings: SettingsType) => void,
) => {
  const getRawCookies = () => (isPersistent ? JSON.stringify(getSettings()) : '');
  const eraseCookies = () => { setSettings({}); };
  const setter = (key: string, v: SettingsTypes) => {
    const settings = getSettings();
    if (settings[key] !== v) {
      setSettings({ ...settings, [key]: v });
    }
  };
  const remover = (key: string) => () => {
    const settings = getSettings();
    if (key in settings) {
      const { [key]: value, ...t } = getSettings();
      setSettings(t);
    }
  };
  const useStringNullableSetting = (key: string) => {
    const value = getSettings()[key];
    return [
      typeof value === 'string' ? value : undefined,
      (v: string) => setter(key, v),
      remover(key),
    ] as const;
  };
  const useStringSetting = (key: string, initValue: string = '') => {
    const value = getSettings()[key];
    return [
      typeof value === 'string' ? value : initValue,
      (v: string) => setter(key, v),
      remover(key),
    ] as const;
  };
  const useNumberSetting = (key: string, initValue: number = 0) => {
    const value = getSettings()[key];
    return [
      typeof value === 'number' ? value : initValue,
      (v: number) => setter(key, v),
      remover(key),
    ] as const;
  };
  const useBooleanSetting = (key: string, initValue?: boolean) => {
    const value = getSettings()[key];
    return [
      typeof value === 'boolean' ? value : initValue,
      (v: boolean) => setter(key, v),
      remover(key),
    ] as const;
  };
  const useObjectSetting = <T extends Object>(key: string, initValue: T) => {
    const value = getSettings()[key];
    return [
      typeof value === 'object' ? value as T : initValue,
      (v: T) => setter(key, v),
      remover(key),
    ] as const;
  };
  return {
    isPersistent,
    getRawCookies,
    eraseCookies,
    useStringNullableSetting,
    useStringSetting,
    useNumberSetting,
    useBooleanSetting,
    useObjectSetting,
  };
};

export default getSettingsContextValue;
