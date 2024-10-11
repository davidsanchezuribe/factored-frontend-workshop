import React, { PropsWithChildren } from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import PageNotFound from './views/PageNotFound';
import { WithAuthType } from './views/WithAuthProps';
import useRoutes from './useRoutes';

export type RoutedAppProps = PropsWithChildren<{
  NavBar?: React.JSX.Element,
  homePath?: string,
  notFoundPath?: string,
  withAuth?: WithAuthType
}>;

const RoutedApp = ({
  NavBar,
  homePath = '/',
  notFoundPath = '/404',
  withAuth,
  children,
} : RoutedAppProps) => {
  const { SUBDOMAIN } = process.env;
  const { hostname } = window.location;
  const basename = SUBDOMAIN === '' || hostname.includes(`${SUBDOMAIN}.`)
    ? '/' : `/${SUBDOMAIN}`;
  const { routesBuilder } = useRoutes();
  const routes = routesBuilder(homePath, withAuth);
  return (
    <BrowserRouter basename={basename}>
      { NavBar }
      <Routes>
        { children }
        { routes }
        { homePath !== '/' && <Route path="/" element={<Navigate to={homePath} replace />} />}
        <Route path={notFoundPath} element={<PageNotFound />} />
        <Route path="*" element={<Navigate to={notFoundPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutedApp;
