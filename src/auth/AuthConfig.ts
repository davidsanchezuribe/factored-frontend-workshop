export type CountryCode = 'AC' | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HN' | 'HR' | 'HT' | 'HU' | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' | 'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' | 'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ' | 'TA' | 'TC' | 'TD' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA' | 'UG' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU' | 'WF' | 'WS' | 'XK' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW';

export type UserAuthConfig = {
  features?: {
    emailSignIn?: boolean,
    emailSignUp?: boolean,
    emailLinkLogin?: boolean,
    passwordReset?: boolean,
    googleLogin?: boolean,
    facebookLogin?: boolean,
    twitterLogin?: boolean,
    twoFactorAuthentication?: boolean,
  },
  manageAccount?: {
    cookiesStorageEnabler?: boolean,
    preferredCountries?: CountryCode[],
  },
  userPreferences?: {
    displayNameNullable?: boolean,
    localDisplayNameProfanityFilter?: boolean,
    apiDisplayNameProfanityFilter?: boolean,
    userAvatar?: boolean,
    userPic?: boolean,
    userPicProfanityFilter?: boolean,
  },
  paths?: {
    homePath?: string,
    notFoundPath?: string,
    loginPath?: string,
    manageAccountPath?: string,
    passwordResetPath?: string,
    signUpPath?: string,
  },
  notTraceablePaths? : string[],
};

const absolutePath = (path: string) => (path.charAt(0) === '/' ? path : '/'.concat(path));

const defaultPaths = {
  defaultHomePath: '/home',
  defaultNotFoundPath: '/404',
  defaultLoginPath: '/login',
  defaultManageAccountPath: '/account',
  defaultPasswordResetPath: '/password-reset',
  defaultSignUpPath: '/signup',
};

export class AuthConfig {
  features: {
    emailSignIn: boolean,
    emailSignUp: boolean,
    emailLinkLogin: boolean,
    passwordReset: boolean,
    googleLogin: boolean,
    facebookLogin: boolean,
    twitterLogin: boolean,
    twoFactorAuthentication: boolean,
  };

  manageAccount: {
    cookiesStorageEnabler: boolean,
    preferredCountries: CountryCode[],
  };

  userPreferences: {
    displayNameNullable: boolean,
    localDisplayNameProfanityFilter: boolean,
    apiDisplayNameProfanityFilter: boolean,
    userAvatar: boolean,
    userPic: boolean,
    userPicProfanityFilter: boolean,
  };

  paths: {
    homePath: string,
    notFoundPath: string,
    loginPath: string,
    manageAccountPath: string,
    passwordResetPath: string,
    signUpPath: string,
  };

  notTraceablePaths: string[];

  constructor(authConfig: UserAuthConfig = {}) {
    const {
      features: {
        emailSignIn,
        emailSignUp,
        emailLinkLogin,
        passwordReset,
        googleLogin,
        facebookLogin,
        twitterLogin,
        twoFactorAuthentication,
      } = {},
      manageAccount: {
        cookiesStorageEnabler,
        preferredCountries,
      } = {},
      userPreferences: {
        displayNameNullable,
        localDisplayNameProfanityFilter,
        apiDisplayNameProfanityFilter,
        userAvatar,
        userPic,
        userPicProfanityFilter,
      } = {},
      paths: {
        homePath: userHomePath,
        notFoundPath: userNotFoundPath,
        loginPath: userLoginPath,
        manageAccountPath: userManageAccountPath,
        passwordResetPath: userPasswordResetPath,
        signUpPath: userSignUpPath,
      } = {},
      notTraceablePaths = [],
    } = authConfig;
    const {
      defaultHomePath,
      defaultNotFoundPath,
      defaultLoginPath,
      defaultManageAccountPath,
      defaultPasswordResetPath,
      defaultSignUpPath,
    } = defaultPaths;
    this.features = {
      emailSignIn: emailSignIn === undefined ? true : emailSignIn,
      emailSignUp: emailSignUp === undefined ? true : emailSignUp,
      emailLinkLogin: emailLinkLogin === undefined ? true : emailLinkLogin,
      passwordReset: passwordReset === undefined ? true : passwordReset,
      googleLogin: googleLogin === undefined ? true : googleLogin,
      facebookLogin: facebookLogin === undefined ? true : facebookLogin,
      twitterLogin: twitterLogin === undefined ? true : twitterLogin,
      twoFactorAuthentication: twoFactorAuthentication === undefined
        ? true : twoFactorAuthentication,
    };
    this.manageAccount = {
      cookiesStorageEnabler: cookiesStorageEnabler === undefined ? true : cookiesStorageEnabler,
      preferredCountries: preferredCountries || ['CO', 'US'],
    };
    this.userPreferences = {
      localDisplayNameProfanityFilter: localDisplayNameProfanityFilter || false,
      apiDisplayNameProfanityFilter: apiDisplayNameProfanityFilter || false,
      displayNameNullable: displayNameNullable || false,
      userAvatar: userAvatar === undefined ? true : userAvatar,
      userPic: userPic || false,
      userPicProfanityFilter: userPicProfanityFilter || false,
    };
    const homePath = userHomePath ? absolutePath(userHomePath) : defaultHomePath;
    const notFoundPath = userNotFoundPath ? absolutePath(userNotFoundPath) : defaultNotFoundPath;
    const loginPath = userLoginPath ? absolutePath(userLoginPath) : defaultLoginPath;
    const manageAccountPath = userManageAccountPath
      ? absolutePath(userManageAccountPath) : defaultManageAccountPath;
    const passwordResetPath = userPasswordResetPath
      ? absolutePath(userPasswordResetPath) : defaultPasswordResetPath;
    const signUpPath = userSignUpPath ? absolutePath(userSignUpPath) : defaultSignUpPath;
    this.paths = {
      homePath,
      notFoundPath,
      loginPath,
      manageAccountPath,
      passwordResetPath,
      signUpPath,
    };
    this.notTraceablePaths = [
      ...notTraceablePaths,
      notFoundPath,
      loginPath,
      signUpPath,
      passwordResetPath,
    ];
  }
}
