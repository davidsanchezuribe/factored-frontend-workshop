import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { MenuIconType } from './MenuIconBuilder';
import useTrace from '../useTrace';

type Path = {
  route: string,
  decoreOnMatch?: boolean,
  disableOnMatch?: boolean,
};

export type PathOrAction = Path | (() => void) | undefined;

export type DropdownButtonProps = {
  MenuIcon: MenuIconType,
  name?: string,
  pathOrAction: PathOrAction,
  isTooltip?: boolean,
};

export type DropdownLinkProps = {
  name: string,
  pathOrAction: PathOrAction,
  nestedLinks?: DropdownLinkProps[] | DropdownButtonProps[],
};

const pathLint = (path: string) => {
  if (path.length > 0) {
    if (path.charAt(0) === '/') {
      return path.substring(1);
    }
  }
  return path;
};

const pathMatch = (firstPath: string, secondPath: string) => pathLint(firstPath)
  .localeCompare(pathLint(secondPath)) === 0;

export const decodePathOrAction = (pathOrAction: PathOrAction, decoreType: 'light' | 'dark' = 'dark') => {
  if (pathOrAction && 'route' in pathOrAction) {
    const {
      route, decoreOnMatch = true, disableOnMatch = true,
    } = pathOrAction;
    const { pathname } = useLocation();
    const match = pathMatch(pathname, route);
    const { navigate } = useTrace();
    const { palette: { secondary } } = useTheme();
    const decoreColor = secondary[decoreType];
    return {
      callback: () => { navigate(route); },
      decoreColor: decoreOnMatch && match ? decoreColor : undefined,
      disable: disableOnMatch && match,
    };
  }
  return {
    callback: pathOrAction,
    decoreColor: undefined,
    disable: undefined,
  };
};
