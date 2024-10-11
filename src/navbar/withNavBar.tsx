/* eslint-disable react/require-default-props */
import React, { PropsWithChildren, useState } from 'react';
import NavBarBuilder from './NavBarBuilder';
import { HardHandlerPromise } from '../materialui/useFeedback';
import { RoutedAppProps } from '../RoutedApp';
import { WithAuthType } from '../views/WithAuthProps';
import useRoutes from '../useRoutes';

export type WithNavBarProps = PropsWithChildren<{
  authSignOut?: HardHandlerPromise<'auth/server-error'>,
  paths?: {
    homePath?: string,
    notFoundPath?: string,
    loginPath?: string,
    signUpPath?: string,
    passwordResetPath?: string,
    manageAccountPath?: string,
  },
  user? : { logged?: boolean, displayName?: string | null, photoURL?: string | null },
  withAuth?: WithAuthType,
}>;

const withNavBar = (
  BaseApp: React.ComponentType<RoutedAppProps>,
) => ({
  authSignOut,
  children,
  paths = {},
  user,
  withAuth,
}: WithNavBarProps) => {
  const [toggle, setToggle] = useState(false);
  const refreshParent = () => { setToggle(!toggle); };
  const { homePath = '/', notFoundPath } = paths;
  const { pagesBuilder, iconPagesBuilder } = useRoutes();
  const pages = pagesBuilder(homePath, withAuth, user?.logged);
  const iconPages = iconPagesBuilder(homePath, withAuth, user?.logged);
  return (
    <BaseApp
      NavBar={(
        <NavBarBuilder
          authSignOut={authSignOut}
          pages={pages}
          iconPages={iconPages}
          paths={paths}
          refreshParent={refreshParent}
          user={user}
        />
      )}
      homePath={homePath}
      notFoundPath={notFoundPath}
      withAuth={withAuth}
    >
      {children}
    </BaseApp>
  );
};

export default withNavBar;
