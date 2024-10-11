import {
  IconRouteType, RouteType, buildIconPages, buildPages, buildRoutes,
} from './routeHandlers';
import CorporativeDirectory from './views/CorporativeDirectory';
import { WithAuthType } from './views/WithAuthProps';

const useRoutes = () => {
  const routeDefinitions: (homePath: string) => RouteType[] = (homePath: string) => [
    { path: homePath, PrivateComponent: CorporativeDirectory },
  ];
  const pagesBuilder = (
    homePath: string,
    withAuth?: WithAuthType,
    authUser?: boolean,
  ) => buildPages(routeDefinitions(homePath), homePath, withAuth, authUser);
  const iconRouteDefinitions: IconRouteType[] = [];
  const routesBuilder = (
    homePath: string,
    withAuth?: WithAuthType,
  ) => buildRoutes([...routeDefinitions(homePath), ...iconRouteDefinitions], withAuth);
  const iconPagesBuilder = (
    homePath: string,
    withAuth?: WithAuthType,
    authUser?: boolean,
  ) => buildIconPages(iconRouteDefinitions, homePath, withAuth, authUser);
  return { routesBuilder, pagesBuilder, iconPagesBuilder };
};

export default useRoutes;
