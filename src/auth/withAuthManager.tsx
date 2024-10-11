import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { authObserver, authSignOut } from './authManager';
import authBuilder from './authBuilder';
import { AuthUser } from './AuthManagerTypes';
import { WithNavBarProps } from '../navbar/withNavBar';
import withAuthBuilder from './withAuthBuilder';
import Loading from '../materialui/Loading';

const checkLoggedTimer = 2000;

const withAuthManager = (
  BaseApp: React.ComponentType<WithNavBarProps>,
) => () => {
  const {
    paths,
    EmailSign,
    Login,
    PasswordReset,
    SignUp,
    ManageAccount,
  } = authBuilder();
  const {
    homePath,
    loginPath,
    signUpPath,
    passwordResetPath,
    manageAccountPath,
  } = paths;
  const [rawAuthUser, setRawAuthUser] = useState<AuthUser | null>(null);
  const [toggle, setToggle] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const authUser = loading ? rawAuthUser || undefined : rawAuthUser;
  const userRefresh = (timeRefresh = 3000) => () => {
    setTimeout(() => { setToggle(Date.now()); }, timeRefresh);
  };
  useEffect(() => authObserver(setRawAuthUser), [toggle]);
  useEffect(() => { setTimeout(() => { setLoading(false); }, checkLoggedTimer); }, []);
  const buildRoute = (path: string, Component: React.ComponentType | undefined) => {
    if (!Component) return undefined;
    if (authUser === undefined) {
      return (
        <Route
          key={path}
          path={path}
          element={<Loading loading />}
        />
      );
    }
    return (
      <Route
        key={path}
        path={path}
        element={authUser ? <Navigate to={homePath} replace /> : <Component />}
      />
    );
  };
  const withAuth = withAuthBuilder(
    authUser,
    userRefresh,
    loginPath,
    homePath,
  );
  const WrappedManageAccount = useMemo(() => withAuth(ManageAccount), [authUser]);
  const authRoutes = [
    buildRoute(loginPath, Login),
    buildRoute(passwordResetPath, PasswordReset),
    buildRoute(signUpPath, SignUp),
    <Route key={manageAccountPath} path={manageAccountPath} element={<WrappedManageAccount />} />,
  ];
  const { displayName, photoURL } = authUser || {};
  return (
    <>
      {React.useMemo(
        () => (
          <BaseApp
            authSignOut={authSignOut}
            paths={{
              ...paths,
              passwordResetPath: PasswordReset && passwordResetPath,
              signUpPath: SignUp && signUpPath,
            }}
            user={{ logged: !!authUser, displayName, photoURL }}
            withAuth={withAuth}
          >
            {authRoutes}
          </BaseApp>
        ),
        [authUser],
      )}
      {EmailSign && React.useMemo(() => (<EmailSign userRefresh={userRefresh(0)} />), [])}
    </>
  );
};

export default withAuthManager;
