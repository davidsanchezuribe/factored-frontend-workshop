export type WithAuthProps = {
  authUser: {
    email: string | null;
    idToken: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    providers: string[];
    enrolledPhone: string | null,
    enrolledTotp: boolean,
    lastSignInTime: number | undefined,
  },
  userRefresh: (refreshTime?: number) => () => void,
};

export type WithAuthType = (Component: React.FC<WithAuthProps>) => React.FC;
