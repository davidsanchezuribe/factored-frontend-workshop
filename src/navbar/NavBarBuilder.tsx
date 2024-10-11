import React, { useEffect } from 'react';
import NavigationBar from './NavigationBar';
import useFeedback, { HardHandlerPromise } from '../materialui/useFeedback';
import useLocalization from '../localization/useLocalization';
import logoImage from '../images/logo.png';
import { useSetting } from '../settings/withSettings';
import { DropdownLinkProps } from '../materialui/DropdownLinkProps';
import { CustomMenuProps } from '../materialui/CustomMenu';

export type NavBarBuilderProps = {
  authSignOut?: HardHandlerPromise<'auth/server-error'>,
  pages?: DropdownLinkProps[],
  iconPages?: CustomMenuProps[],
  paths?: {
    homePath?: string,
    notFoundPath?: string,
    loginPath?: string,
    signUpPath?: string,
    passwordResetPath?: string,
    manageAccountPath?: string,
  },
  refreshParent?: () => void,
  user? : { logged?: boolean, displayName?: string | null, photoURL?: string | null },
};

const NavBarBuilder = ({
  refreshParent,
  authSignOut,
  pages = [],
  iconPages = [],
  paths = {},
  user = {},
}: NavBarBuilderProps) => {
  const {
    getMessages, getAvailableLanguages, getLanguage, setLanguage,
  } = useLocalization();
  const messages = getMessages();
  const { useStringSetting } = useSetting();
  const { fnHardHandler } = useFeedback();
  const browserLanguage = (navigator.language || navigator.userLanguage).substring(0, 2);
  const [preferredLanguage, setPreferredLanguage] = useStringSetting(
    'language',
    getAvailableLanguages().includes(browserLanguage)
      ? browserLanguage : getAvailableLanguages()[0],
  );
  const localization = {
    languages: getAvailableLanguages(),
    setLanguage: setPreferredLanguage,
    language: getLanguage(),
    hideOnXS: false,
  };
  useEffect(() => {
    if (preferredLanguage !== getLanguage()) {
      setLanguage(preferredLanguage);
      if (refreshParent) refreshParent();
    }
  }, [preferredLanguage]);
  const {
    homePath = '/home', loginPath, signUpPath, manageAccountPath,
  } = paths;
  const homeInfo = { hasLogo: true, logoImageOrAppName: logoImage, homePath };
  const searchField = undefined;
  const { logged, displayName, photoURL } = user;
  const notLoggedSession = !logged && loginPath
    ? {
      accountTooltipName: messages.navBar.account,
      signIn: {
        name: messages.navBar.signIn,
        pathOrAction: { route: loginPath, disableOnMatch: true },
      },
      signUp: signUpPath ? {
        name: messages.navBar.signUp,
        pathOrAction: { route: signUpPath, disableOnMatch: true },
      } : undefined,
    } : undefined;
  const loggedSession = logged && authSignOut ? {
    accountTooltipName: messages.navBar.account,
    greetingMessage: messages.navBar.greeting,
    userName: displayName || undefined,
    userImage: photoURL || undefined,
    userPages: manageAccountPath
      ? [{ name: messages.navBar.manageAccount, pathOrAction: { route: manageAccountPath } }] : [],
    logout: {
      pathOrAction: () => fnHardHandler(authSignOut, { errorMessages: messages.navBar.errors }),
      name: messages.navBar.logout,
    },
    showLogoutButton: false,
  } : undefined;

  return (
    <NavigationBar
      homeInfo={homeInfo}
      pages={pages}
      iconPages={iconPages}
      searchField={searchField}
      localization={localization}
      notLoggedSession={notLoggedSession}
      loggedSession={loggedSession}
    />
  );
};

NavBarBuilder.defaultProps = {
  authSignOut: undefined,
  pages: undefined,
  iconPages: undefined,
  paths: undefined,
  refreshParent: undefined,
  user: undefined,
};

export default NavBarBuilder;
