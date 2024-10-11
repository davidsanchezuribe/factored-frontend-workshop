import { UserAuthConfig, AuthConfig } from './auth/AuthConfig';

const userAuthConfig: UserAuthConfig = {
  features: {
    emailSignIn: true,
    emailSignUp: true,
    emailLinkLogin: true,
    passwordReset: true,
    googleLogin: true,
    facebookLogin: true,
    twitterLogin: true,
    twoFactorAuthentication: true,
  },
  manageAccount: {
    cookiesStorageEnabler: true,
    preferredCountries: ['CO', 'US'],
  },
  userPreferences: {
    localDisplayNameProfanityFilter: false,
    apiDisplayNameProfanityFilter: false,
    displayNameNullable: false,
    userAvatar: true,
    userPic: true,
    userPicProfanityFilter: false,
  },
  paths: {
    homePath: '/home',
    notFoundPath: '/404',
    loginPath: '/login',
    manageAccountPath: '/account',
    passwordResetPath: '/password-reset',
    signUpPath: '/signup',
  },
  notTraceablePaths: [],
};

const authConfig = new AuthConfig(userAuthConfig);

export default authConfig;
