export type SettingsTypes = string | number | boolean | Object;

export type SettingsType = { [key: string]: SettingsTypes };

export type SettingsContextType = {
  isPersistent: boolean,
  getRawCookies: () => string,
  eraseCookies: () => void,
  useStringNullableSetting: (key: string) => readonly [
    string | undefined,
    (value: string) => void,
    () => void,
  ],
  useStringSetting: (key: string, initValue?: string) => readonly [
    string,
    (value: string) => void,
    () => void,
  ],
  useNumberSetting: (key: string, initValue?: number) => readonly [
    number,
    (value: number) => void,
    () => void,
  ],
  useBooleanSetting: (key: string, initValue?: boolean) => readonly [
    boolean | undefined,
    (value: boolean) => void,
    () => void,
  ],
  useObjectSetting: <T extends Object>(key: string, initValue: T) => readonly [
    T,
    (value: T) => void,
    () => void,
  ],
};

export type GetSettingsContextValue = (
  isPersistent: boolean,
  getSettings: () => SettingsType,
  setSettings: (settings: SettingsType) => void,
) => SettingsContextType;

export type UsePersistence = () => {
  isPersistent: boolean,
  getSettings: () => SettingsType,
  setSettings: (settings: SettingsType) => void,
};
