import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import SvgIcon from '@mui/material/SvgIcon';
import { WithAuthProps, WithAuthType } from './views/WithAuthProps';
import { DropdownLinkProps } from './materialui/DropdownLinkProps';
import { pushReturn } from './utilities';
import { CustomMenuProps } from './materialui/CustomMenu';

type PublicComponent = () => React.JSX.Element | null;

type PrivateComponent = ({ authUser }: WithAuthProps) => React.JSX.Element | null;

type PrivateNodeRoute = {
  name: string,
  nestedRoutes: PrivateRouteType[];
};

type PrivateActionRoute = {
  action: () => void,
  name: string,
  nestedRoutes?: PrivateRouteType[],
};

type PrivatePathRoute = {
  path: string,
  nestedRoutes?: PrivateRouteType[],
} & ({
  hide?: false,
  name?: string,
  showOnDifferentState?: boolean,
  decoreOnMatch?: boolean,
  disableOnMatch?: boolean,
} | {
  hide: true,
}) & ({
  PublicComponent: PublicComponent,
} | {
  PrivateComponent: PrivateComponent,
});

type PrivateRouteType = PrivateNodeRoute | PrivateActionRoute | PrivatePathRoute;

type PathRouteExclusive = {
  path?: never,
  hide?: never,
  showOnDifferentState?: never,
  decoreOnMatch?: never,
  disableOnMatch?: never,
  PublicComponent?: never,
  PrivateComponent?: never,
};

type NodeRoute = {
  name: string,
  nestedRoutes: RouteType[];
} & PathRouteExclusive;

type ActionRoute = {
  name: string,
  nestedRoutes?: RouteType[],
  action: () => void,
} & PathRouteExclusive;

type PathRoute = {
  path: string,
  nestedRoutes?: RouteType[],
  action?: never,
} & ({
  hide?: false,
  name?: string,
  showOnDifferentState?: boolean,
  decoreOnMatch?: boolean,
  disableOnMatch?: boolean,
} | {
  hide: true,
  name?: never,
  showOnDifferentState?: never,
  decoreOnMatch?: never,
  disableOnMatch?: never,
}) & ({
  PublicComponent: PublicComponent,
  PrivateComponent?: never,
} | {
  PublicComponent?: never,
  PrivateComponent: PrivateComponent,
});

export type RouteType = PathRoute | ActionRoute | NodeRoute;

type PrivateIconRouteType = {
  Icon: typeof SvgIcon,
  badgeContent: number,
  isAlert?: boolean,
  hideOnXS?: boolean,
  name?: string,
} & ({
  nestedRoutes: PrivateRouteType[],
} | {
  action: (() => void),
  nestedRoutes?: PrivateRouteType[],
} | ({
  path: string,
  showOnDifferentState?: boolean,
  decoreOnMatch?: boolean,
  disableOnMatch?: boolean,
  nestedRoutes?: PrivateRouteType[],
} & ({
  PublicComponent: PublicComponent,
} | {
  PrivateComponent: PrivateComponent,
})));

export type IconRouteType = {
  Icon: typeof SvgIcon,
  badgeContent: number,
  isAlert?: boolean,
  hideOnXS?: boolean,
  name?: string,
} & ({
  nestedRoutes: RouteType[],
  path?: never,
  showOnDifferentState?: never,
  decoreOnMatch?: never,
  disableOnMatch?: never,
} | {
  action: (() => void),
  nestedRoutes?: RouteType[],
  path?: never,
  showOnDifferentState?: never,
  decoreOnMatch?: never,
  disableOnMatch?: never,
} | ({
  path: string,
  showOnDifferentState?: boolean,
  decoreOnMatch?: boolean,
  disableOnMatch?: boolean,
  nestedRoutes?: RouteType[],
  action?: never,
} & ({
  PublicComponent: PublicComponent,
  PrivateComponent?: never,
} | {
  PublicComponent?: never,
  PrivateComponent: PrivateComponent,
})));

type BuildRoutesType = (
  routes?: (PrivateRouteType | PrivateIconRouteType)[],
  withAuth?: WithAuthType,
) => ReactNode;

export const buildRoutes: BuildRoutesType = (
  routes,
  withAuth,
) => {
  if (!routes) return undefined;
  return routes.map((route) => {
    const { nestedRoutes } = route;
    if (!('path' in route)) return buildRoutes(nestedRoutes, withAuth);
    const { path } = route;
    if ('PrivateComponent' in route) {
      const { PrivateComponent } = route;
      if (withAuth) {
        const WrappedComponent = withAuth(PrivateComponent);
        return (
          <Route key={path} path={path}>
            <Route index element={<WrappedComponent />} />
            {buildRoutes(nestedRoutes, withAuth)}
          </Route>
        );
      }
      return undefined;
    }
    const { PublicComponent } = route;
    return (
      <Route key={path} path={path}>
        <Route index element={<PublicComponent />} />
        {buildRoutes(nestedRoutes, withAuth)}
      </Route>
    );
  });
};

const buildPath = (path: string, homePath: string, root: string) => {
  if (path === homePath && root === '/') return homePath;
  return root === '/' ? `${root}${path}` : `${root}/${path}`;
};

type BuildPagesType = (
  routes: PrivateRouteType[],
  homePath: string,
  withAuth?: WithAuthType,
  authUser?: boolean,
  root?: string,
) => (DropdownLinkProps)[];

export const buildPages: BuildPagesType = (
  routes,
  homePath,
  withAuth?,
  authUser?,
  root = '/',
) => routes.reduce<(DropdownLinkProps)[]>((acum, route) => {
  const { nestedRoutes } = route;
  if (!('path' in route)) {
    const { name } = route;
    const action = 'action' in route ? route.action : undefined;
    const nestedLinks = nestedRoutes
      ? buildPages(nestedRoutes, homePath, withAuth, authUser, root) : undefined;
    return pushReturn(acum, { name, pathOrAction: action, nestedLinks });
  }

  const { path } = route;
  const wrappedPath = buildPath(path, homePath, root);
  const nestedLinks = nestedRoutes
    ? buildPages(nestedRoutes, homePath, withAuth, authUser, wrappedPath) : undefined;
  if (route.hide || (wrappedPath === homePath)) return acum.concat(nestedLinks || []);

  const {
    name, showOnDifferentState, decoreOnMatch, disableOnMatch,
  } = route;
  const isPrivate = 'PrivateComponent' in route;
  if (isPrivate && (!withAuth || (!showOnDifferentState && !authUser))) {
    return acum.concat(nestedLinks || []);
  }
  return pushReturn(acum, {
    name: name || wrappedPath.substring(wrappedPath.lastIndexOf('/') + 1),
    pathOrAction: { route: wrappedPath, decoreOnMatch, disableOnMatch },
    nestedLinks,
  });
}, []);

type BuildIconPagesType = (
  routes: PrivateIconRouteType[],
  homePath: string,
  withAuth?: WithAuthType,
  authUser?: boolean,
  root?: string,
) => CustomMenuProps[];

export const buildIconPages: BuildIconPagesType = (
  routes,
  homePath,
  withAuth?,
  authUser?,
  root = '/',
) => routes.reduce<CustomMenuProps[]>((acum, route) => {
  const {
    Icon: MenuIcon, badgeContent, isAlert, hideOnXS, name, nestedRoutes,
  } = route;
  const hideBreakpoints: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[] | undefined = hideOnXS ? ['xs', 'sm'] : undefined;
  const commonProps = {
    hideBreakpoints,
    MenuIcon,
    tooltip: name,
    badgeContent,
    isAlert,
  };
  if (!('path' in route)) {
    const action = 'action' in route ? route.action : undefined;
    const nestedLinks = nestedRoutes
      ? buildPages(nestedRoutes, homePath, withAuth, authUser, root) : undefined;
    return pushReturn(acum, {
      ...commonProps,
      pathOrAction: action,
      links: nestedLinks,
    });
  }
  const {
    path, showOnDifferentState, decoreOnMatch, disableOnMatch,
  } = route;
  const wrappedPath = buildPath(path, homePath, root);
  const nestedLinks = nestedRoutes
    ? buildPages(nestedRoutes, homePath, withAuth, authUser, wrappedPath) : undefined;
  const isPrivate = 'PrivateComponent' in route;
  if ((wrappedPath === homePath)
    || (isPrivate && (!withAuth || (!showOnDifferentState && !authUser)))) {
    return nestedLinks && nestedLinks.length > 0 ? pushReturn(acum, {
      ...commonProps,
      pathOrAction: undefined,
      links: nestedLinks,
    }) : acum;
  }
  return pushReturn(acum, {
    ...commonProps,
    pathOrAction: {
      route: wrappedPath, decoreOnMatch, disableOnMatch,
    },
    links: nestedLinks,
  });
}, []);
