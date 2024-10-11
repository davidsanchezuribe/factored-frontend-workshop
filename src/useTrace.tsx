import React from 'react';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  Navigate as RawNavigate,
  NavigateOptions,
  useSearchParams,
} from 'react-router-dom';
import {
  Link as RawLink,
  LinkProps as MuiLinkProps,
  Button,
  ButtonOwnProps,
  IconButton,
  IconButtonOwnProps,
} from '@mui/material';
import authConfig from './authConfig';

const { notTraceablePaths, paths: { homePath } } = authConfig;

type NavigateProps = { to: string, state?: any };

type NavigateFunction = {
  (to: string, options?: NavigateOptions): void;
  (delta: number): void;
  (options?: NavigateOptions): void;
};

type LinkProps<P> = Omit<P, 'component'> & { to: string, state?: any };

const useTrace = () => {
  const { pathname, state: previousState } = useLocation();
  const rawNavigate = useNavigate();
  const previousPath = notTraceablePaths.includes(pathname)
    ? previousState?.previousPath : pathname;
  const optionsWithTrace = (additionalOptions?: NavigateOptions) => ({
    ...additionalOptions,
    state: { ...additionalOptions?.state, previousPath },
  });
  const [queryParams] = useSearchParams();
  const redirectPath = queryParams.get('previousPath')
  || (previousState && previousState.previousPath)
  || homePath;
  const navigate: NavigateFunction = (firstArg, secondArg?) => {
    if (typeof firstArg === 'string') {
      rawNavigate(firstArg, optionsWithTrace(secondArg || undefined));
      return;
    }
    if (typeof firstArg === 'number') { rawNavigate(firstArg); return; }
    rawNavigate(redirectPath, optionsWithTrace(firstArg || undefined));
  };
  const Navigate = (
    { to, state }: NavigateProps,
  ) => <RawNavigate to={to} state={{ ...state, previousPath }} replace />;
  const Link = (props: LinkProps<MuiLinkProps>) => {
    const { children, state } = props;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <RawLink {...props} component={RouterLink} state={{ ...state, previousPath }}>
        {children}
      </RawLink>
    );
  };
  const ButtonLink = (props: LinkProps<ButtonOwnProps>) => {
    const { children, state } = props;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Button {...props} component={RouterLink} state={{ ...state, previousPath }}>
        {children}
      </Button>
    );
  };
  const IconButtonLink = (props: LinkProps<IconButtonOwnProps>) => {
    const { children, state } = props;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <IconButton {...props} component={RouterLink} state={{ ...state, previousPath }}>
        {children}
      </IconButton>
    );
  };
  return {
    navigate, Navigate, Link, ButtonLink, IconButtonLink, redirectPath,
  };
};

export default useTrace;
