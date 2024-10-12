export type AppMessages = {
  corporativeDirectory: {
    retrievingData: string,
    showSkills: string,
    closeDialog: string,
    headers: {
      avatar: string,
      name: string,
      position: string,
      skills: string,
    },
  },
  navBar: {
    account: string,
    signIn: string,
    signUp: string,
    logout: string,
    greeting: string,
    manageAccount: string,
    errors: {
      'auth/server-error': string,
    },
  },
  strengthBar: {
    level1: string,
    level2: string,
    level3: string,
    level4: string,
    tooShort: string,
  },
  login: {
    form: {
      title: string,
      altTitle: string,
      reset: string,
      login: string,
      or: string,
      forgotPassword: string,
      notRegistered: string,
    },
    email: {
      label: string,
      valid: string,
      required: string,
    },
    password: {
      label: string,
      required: string,
    },
    emailLink: {
      label: string,
      tooltip: string,
    },
    remember: {
      label: string,
      tooltip: string,
      noStorage: string,
    },
    sentMail: string,
    sentLink: string,
    tryAgain: string,
    errors: {
      'auth/web-storage-unsupported': string,
      'auth/user-not-found': string,
      'auth/wrong-password': string,
      'auth/server-error': string,
      'auth/too-many-requests': string,
      'auth/quota-exceeded': string,
      'auth/network-request-failed': string,
      'auth/multi-factor-auth-required': string,
      'auth/invalid-credential': string,
    },
    userNotFoundDialog: {
      title: string,
      description: string,
      positiveLabel: string,
      negativeLabel: string,
    },
  },
  mfaLogin: {
    title: string,
    phone: {
      description: {
        prefix: string,
        suffix: string,
      },
      notSolvedCaptcha: string,
      sendSMS: string,
      wait: string,
      sendedSMS: string,
      errors: {
        'auth/invalid-verification-id': string,
        'auth/invalid-verification-code': string,
        'auth/undefined-verifier': string,
        'auth/network-request-failed': string,
        'auth/server-error': string,
      },
    },
    totp: {
      enterCode: string,
      errors: {
        'auth/invalid-verification-code': string,
        'auth/network-request-failed': string,
        'auth/server-error': string,
      },
    },
  },
  passwordReset: {
    form: {
      title: string,
      clean: string,
      reset: string,
      backToLogin: string,
      socialNetworks: string,
      clickHere: string,
      notRegistered: string,
    },
    email: {
      label: string,
      valid: string,
      required: string,
    },
    sentMailDialog: {
      description: string,
      okLabel: string,
      cancelLabel: string,
    },
    errors: {
      'auth/user-not-found': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
    userNotFoundDialog: {
      title: string,
      description: string,
      positiveLabel: string,
      negativeLabel: string,
    },
  },
  signUp: {
    form: {
      title: string,
      reset: string,
      signUp: string,
      alreadyRegistered: string,
      socialNetworks: string,
      clickHere: string,
      unsolvedCaptcha: string,
    },
    email: {
      label: string,
      valid: string,
      required: string,
    },
    confirmEmail: {
      label: string,
      valid: string,
      required: string,
      matchError: string,
      matchSuccess: string,
    },
    password: {
      label: string,
      max: string,
      min: string,
      required: string,
    },
    remember: {
      label: string,
      tooltip: string,
      noStorage: string,
    },
    errors: {
      'auth/web-storage-unsupported': string,
      'auth/email-already-in-use': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
    existentAccountDialog: {
      title: string,
      description: string,
      positiveLabel: string,
      negativeLabel: string,
    },
    cookiesErrorDialog: {
      title: string,
      description: string,
      positiveLabel: string,
    },
  },
  emailSign: {
    email: {
      label: string,
      valid: string,
      required: string,
    },
    errors: {
      'auth/web-storage-unsupported': string,
      'auth/invalid-action-code': string,
      'auth/expired-action-code': string,
      'auth/invalid-email': string,
      'auth/multi-factor-auth-required': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
    setPassword: {
      title: string,
      firstDescription: string,
      secondDescription: string,
    },
    verificatedPrefix: string,
    verificatedSuffix: string,
    mfaVerificated: string,
    enrollReauthenticated: string,
    unenrollReauthenticated: string,
    setpasswordReauthenticated: string,
    deleteReauthenticated: string,
  },
  manageAccount: {
    title: string,
    accountVerification: string,
    setPassword: string,
    changePassword: string,
    preferences: string,
    cookiesStorage: string,
    twoFactorAuthentication: string,
    deleteAccount: string,
  },
  accountVerification: {
    verifiedEmail: string,
    notVerifiedEmailTitle: string,
    notVerifiedEmailDefaultMessage: string,
    notVerifiedEmailMFAMessage: string,
    sendLink: string,
    sentMail: string,
    remember: {
      label: string,
      tooltip: string,
      noStorage: string,
    },
    errors: {
      'auth/server-error': string,
      'auth/quota-exceeded': string,
      'auth/network-request-failed': string,
    },
  },
  twoFactorAuthentication: {
    enrollReauthenticated: string,
  },
  mfaSwitch: {
    viaPhone: string,
    viaTOTP: string,
  },
  mfaPhoneInputCode: {
    label: string,
    codeConfirm: string,
    onlyNumbers: string,
    numChar: string,
  },
  mfaTOTPInputCode: {
    label: string,
    codeConfirm: string,
    onlyNumbers: string,
    numChar: string,
  },
  mfaPhoneEnroll: {
    description: string,
    enrolled: string,
    phone: {
      label: string,
      notValid: string,
      notSolvedCaptcha: string,
      sendSMS: string,
      wait: string,
      sendedSMS: string,
    },
    errors: {
      'auth/invalid-verification-id': string,
      'auth/invalid-verification-code': string,
      'auth/undefined-verifier': string,
      'auth/user-not-found': string,
      'auth/unverified-email': string,
      'auth/requires-recent-login': string,
      'auth/user-token-expired': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
  },
  mfaUnenroll: {
    phoneDescription: string,
    totpDescription: string,
    disablePhoneMFA: string,
    disableTotpMFA: string,
    unenrolledPhoneMFA: string,
    unenrolledTotpMFA: string,
    errors: {
      'auth/user-not-found': string,
      'auth/requires-recent-login': string,
      'auth/user-token-expired': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
  },
  mfaTotpEnroll: {
    generateQR: string,
    secretKey: string,
    clipboard: string,
    secretKeyCopied: string,
    downloadApp: string,
    scanCode: string,
    enterCode: string,
    enrolled: string,
    showSecretKey: string,
    hideSecretKey: string,
    errors: {
      'auth/invalid-verification-code': string,
      'auth/user-not-found': string,
      'auth/network-request-failed': string,
      'auth/server-error': string,
    },
  },
  totpApps: {
    authy: string,
    ma: string,
    ga: string,
  },
  reauthentication: {
    title: string,
    description: string,
    form: {
      reset: string,
      confirm: string,
      sendLink: string,
      or: string,
      // facebookAlt: string,
      // twitterAlt: string,
      // forgotPassword: string,
      // notRegistered: string,
    },
    email: {
      label: string,
    },
    password: {
      label: string,
      required: string,
    },
    emailLink: {
      label: string,
      tooltip: string,
    },
    sentMail: string,
    sentLink: string,
    tryAgain: string,
    errors: {
      'auth/wrong-password': string,
      'auth/web-storage-unsupported': string,
      'auth/server-error': string,
      'auth/quota-exceeded': string,
      'auth/network-request-failed': string,
      'auth/multi-factor-auth-required': string,
      'auth/invalid-credential': string,
    },
  },
  socialProviders: {
    existingSignInMethods: {
      prefix: string,
      and: string,
      suffix: string,
      password: string,
      emailLink: string,
    },
    providerSignInErrors: {
      'auth/multi-factor-auth-required': string,
      'auth/account-exists-with-different-credential': string,
      'auth/web-storage-unsupported': string,
      'auth/popup-blocked': string,
      'auth/cancelled-popup-request': string,
      'auth/popup-closed-by-user': string,
      'auth/server-error': string,
      'auth/user-not-signed': string,
      'auth/internal-error': string,
    },
    facebookAlt: string,
    twitterAlt: string,
  },
  setPassword: {
    form: {
      reset: string,
      setPassword: string,
      successSet: string,
    },
    password: {
      label: string,
      max: string,
      min: string,
      required: string,
    },
    confirmPassword: {
      label: string,
      required: string,
      matchError: string,
      matchSuccess: string,
    },
    errors: {
      'auth/user-not-found': string,
      'auth/requires-recent-login': string,
      'auth/user-token-expired': string,
      'auth/server-error': string,
      'auth/network-request-failed': string,
    },
  },
  preferences: {
    displayName: {
      label: string,
      required: string,
      profane: string,
      max: string,
    },
    avatar: {
      profilePicture: string,
      uploadPicture: string,
      clearPicture: string,
      notTouched: string,
    },
    reset: string,
    updatePreferences: string,
    sameValuesTooltip: string,
    errors: {
      'auth/user-not-found': string,
      'storage/server-error': string,
      'auth/server-error': string,
      'storage/unauthorized': string,
      'storage/retry-limit-exceeded': string,
      'auth/network-request-failed': string,
      'profanity-filter/nsfw-image': string,
      'profanity-filter/nsfw-name': string,
    },
    preferencesUpdated: string,
  },
  cookiesStorage: {
    enable: string,
    disable: string,
    description: string,
    eraseCookies: string,
    showCookies: string,
    hideCookies: string,
    reset: string,
    update: string,
    noChangesTooltip: string,
    noCookiesStoraged: string,
    cookiesEnabled: string,
    cookiesDisabled: string,
  },
  eraseAccount: {
    warning: string,
    deleteData: string,
    deleteAccount: string,
    delete: string,
    notSelected: string,
    deleteReauthenticated: string,
    errors: {
      'storage/unauthorized': string,
      'storage/server-error': string,
      'auth/user-not-found': string,
      'auth/requires-recent-login': string,
      'auth/user-token-expired': string,
      'auth/server-error': string,
      'auth/network-request-failed': string,
    },
  },
  withAuth: {
    signing: string,
    noInternetConnection: {
      title: string,
      description: string,
      primaryActionLabel: string,
      secondaryActionLabel: string,
    },
  },
  cookieConsent: {
    title: string,
    storage: {
      message: string,
      agree: string,
      disagree: string,
    },
    notStorage: {
      message: string,
      understand: string,
    },
  },
  pageNotFound: {
    title: string,
    description: string,
    primaryActionLabel: string,
  },
};

export type LocalizationHook = () => {
  getAvailableLanguages: () => string[],
  getLanguage: () => string,
  getMessages: () => AppMessages,
  setLanguage: (language: string) => void,
  formatString: (message: string, ...args: string[]) => string,
};
