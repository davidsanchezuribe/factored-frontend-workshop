import { DropdownLinkProps } from '../materialui/DropdownLinkProps';
import { CustomMenuProps } from '../materialui/CustomMenu';

type HomeInfo = {
  hasLogo: boolean,
  logoImageOrAppName: string,
  homePath?: string,
};

type SearchField = {
  placeholder: string,
  action: (searchString: string) => Promise<string> | string,
  hideOnXS?: boolean,
};

export type Language = {
  id: string,
  name: string,
  flagImageOrIso3166: string,
} | string;

type Localization = {
  languages: Array<Language>,
  setLanguage: (language: string) => void,
  language: string,
  hideOnXS?: boolean,
};

export type LoggedSession = {
  accountTooltipName?: string,
  greetingMessage?: string,
  userName?: string,
  userImage?: string,
  userPages: Array<DropdownLinkProps>,
  logout: DropdownLinkProps,
  showLogoutButton: boolean,
};

export type NotLoggedSession = {
  accountTooltipName?: string,
  signIn: DropdownLinkProps,
  signUp?: DropdownLinkProps,
};

type NavBarStructure = {
  homeInfo: HomeInfo,
  pages?: Array<DropdownLinkProps>,
  searchField?: SearchField,
  iconPages?: Array<CustomMenuProps>,
  localization?: Localization,
  loggedSession?: LoggedSession,
  notLoggedSession?: NotLoggedSession,
  actionErrorDictionary?: { [key: string]: string },
};

export default NavBarStructure;
