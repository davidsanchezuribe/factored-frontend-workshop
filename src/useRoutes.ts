import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useLocalization from './localization/useLocalization';
import {
  IconRouteType, RouteType, buildIconPages, buildPages, buildRoutes,
} from './routeHandlers';
import HomePage from './views/HomePage';
import PrivateExample from './views/PrivateExample';
import { WithAuthType } from './views/WithAuthProps';

const useRoutes = () => {
  const { getMessages } = useLocalization();
  const { routes: messages } = getMessages();
  const routeDefinitions: (homePath: string) => RouteType[] = (homePath: string) => [
    { path: homePath, PublicComponent: HomePage },
    { name: messages.test, path: 'test', PrivateComponent: PrivateExample },
    { name: messages.action, action: () => { console.log('okis'); } },
  ];
  const pagesBuilder = (
    homePath: string,
    withAuth?: WithAuthType,
    authUser?: boolean,
  ) => buildPages(routeDefinitions(homePath), homePath, withAuth, authUser);
  const iconRouteDefinitions: IconRouteType[] = [
    {
      Icon: MailIcon,
      name: 'mail',
      badgeContent: 17,
      isAlert: true,
      path: 'mail',
      hideOnXS: true,
      PublicComponent: HomePage,
    },
    {
      Icon: NotificationsIcon,
      name: 'notifications',
      badgeContent: 2,
      isAlert: false,
      path: 'alerts',
      disableOnMatch: true,
      hideOnXS: false,
      PrivateComponent: PrivateExample,
    },
  ];
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
