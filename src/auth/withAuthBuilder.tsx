import React from 'react';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Loading, { LoadingStyleProps } from '../materialui/Loading';
import { AuthUser } from './AuthManagerTypes';
import useLocalization from '../localization/useLocalization';
import Dialog from '../materialui/Dialog';
import useTrace from '../useTrace';

export type WithAuthProps = {
  authUser: AuthUser & { idToken: string },
  userRefresh: (refreshTime?: number) => () => void,
};

const withAuthBuilder = (
  authUser: AuthUser | null | undefined,
  userRefresh: (refreshTime?: number) => () => void,
  loginPath: string = '/login',
  homePath: string = '/home',
  loadingStyleProps?: LoadingStyleProps,
) => <P extends WithAuthProps>(
  Component: React.ComponentType<P>,
) => (props: Omit<P, keyof WithAuthProps>) => {
    const { getMessages } = useLocalization();
    const { withAuth: messages } = getMessages();
    const { navigate, Navigate } = useTrace();
    if (authUser) {
      if (authUser.idToken) {
        return (
          <Component
              // eslint-disable-next-line react/jsx-props-no-spreading
            {...props as P}
            authUser={authUser}
            userRefresh={userRefresh}
          />
        );
      }
      return (
        <Dialog
          title={messages.noInternetConnection.title}
          Icon={WifiOffIcon}
          iconColor="error"
          description={messages.noInternetConnection.description}
          primaryAction={{
            action: () => { navigate(0); },
            name: messages.noInternetConnection.primaryActionLabel,
          }}
          secondaryActions={[{
            action: () => { navigate(homePath); },
            name: messages.noInternetConnection.secondaryActionLabel,
          }]}
        />
      );
    }
    if (authUser === undefined) {
      return (
        <Loading
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...loadingStyleProps}
          loading
          message={messages.signing}
        />
      );
    }
    return <Navigate to={loginPath} />;
  };

export default withAuthBuilder;
