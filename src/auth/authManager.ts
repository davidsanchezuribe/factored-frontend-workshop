import React from 'react';
import { initializeApp } from 'firebase/app';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  AuthError,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  MultiFactorError,
  MultiFactorInfo,
  MultiFactorResolver,
  PhoneAuthProvider,
  PhoneInfoOptions,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  TotpMultiFactorGenerator,
  TotpSecret,
  TwitterAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  getMultiFactorResolver,
  getRedirectResult,
  isSignInWithEmailLink,
  multiFactor,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import {
  AuthObserver,
  AuthSignIn,
  AuthSignOut,
  AuthSignUp,
  AuthUser,
  CheckEmailLink,
  CustomAuthError,
  EmailLinkSign,
  EmailReauthentication,
  GetRedirectResult,
  InvisibleRecaptcha,
  MFAUnenrollment,
  MFAResolver,
  MultiFactorAuthentication,
  MFAPhoneEnrollment,
  ResetPassword,
  SendSignLink,
  SetPassword,
  SignInWithProvider,
  SignInWithProviderBuilder,
  UpdateUser,
  VisibleRecaptcha,
  MFAPhonePreSignIn,
  MFAPhonePostSignIn,
  MFATotpGenerateSecret,
  MFATotpEnrollment,
  MFATOTPSignIn,
  DeleteAccount,
} from './AuthManagerTypes';
import firebaseConfig from './firebaseConfig';
import { deleteUserDisplayPicture, uploadUserDisplayPicture } from './storageManager';
import { CustomStorageError } from './StorageManagerTypes';
import { apiNameProfanityFilter, imageProfanityFilter } from './ProfanityFilterManager';
import { ProfanityFilterError } from './ProfanityFilterManagerTypes';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

declare global { interface Window { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean; } }

// if (process.env.RECAPTCHA_SITE_KEY) {
//   window.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.DEBUG_TOKEN;

//   initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(process.env.RECAPTCHA_SITE_KEY),
//     isTokenAutoRefreshEnabled: true,
//   });
// }

const handleCommonErrors: (
  error: AuthError | { code: number } | CustomStorageError | ProfanityFilterError,
) => {
  errorCode: 'auth/network-request-failed' | 'auth/server-error'
} = (error) => {
  if (error.code === 'auth/network-request-failed') return { errorCode: error.code };
  return { errorCode: 'auth/server-error' };
};

const getEnrolledPhone = (enrolledFactors: MultiFactorInfo[]) => {
  for (let i = 0; i < enrolledFactors.length; i += 1) {
    const enrolledFactor = enrolledFactors[i];
    if ('phoneNumber' in enrolledFactor && typeof enrolledFactor.phoneNumber === 'string') {
      return enrolledFactor.phoneNumber;
    }
  }
  return null;
};

const getEnrolledTotp = (enrolledFactors: MultiFactorInfo[]) => {
  for (let i = 0; i < enrolledFactors.length; i += 1) {
    const enrolledFactor = enrolledFactors[i];
    if (enrolledFactor.factorId === 'totp') return true;
  }
  return false;
};

export const authObserver: AuthObserver = (
  setAuthUser: (authUser: AuthUser | null) => void,
) => onAuthStateChanged(
  auth,
  async (user) => {
    if (user) {
      const {
        email,
        displayName,
        photoURL,
        emailVerified,
        providerData,
        metadata: { lastSignInTime: lastSignInTimeStr },
      } = user;
      const userProviders = providerData.map((provider) => provider.providerId);
      const appProviders = email
        ? await fetchSignInMethodsForEmail(auth, email).catch(() => undefined) : undefined;
      const providers = appProviders || userProviders;
      const { enrolledFactors } = multiFactor(user);
      const enrolledPhone = getEnrolledPhone(enrolledFactors);
      const enrolledTotp = getEnrolledTotp(enrolledFactors);
      const lastSignInTime = lastSignInTimeStr
        ? new Date(lastSignInTimeStr).getTime() : undefined;
      const idToken = await user.getIdToken().catch(() => null);
      setAuthUser({
        email,
        idToken,
        displayName,
        photoURL,
        emailVerified,
        providers,
        enrolledPhone,
        lastSignInTime,
        enrolledTotp,
      });
    } else {
      setAuthUser(null);
    }
  },
);

export const authSignUp: AuthSignUp = (
  email: string,
  password: string,
  remember?: boolean,
) => () => {
  setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return createUserWithEmailAndPassword(auth, email, password)
    .then(() => {})
    .catch((error: AuthError | { code: number }) => {
      console.log(error.code);
      if (error.code === 18) return { errorCode: 'auth/web-storage-unsupported' };
      if (error.code === 'auth/email-already-in-use' || error.code === 'auth/network-request-failed') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const multiFactorResolver: MFAResolver = (
  error: AuthError | CustomAuthError | { code: number },
) => {
  if (error.code !== 'auth/multi-factor-auth-required') return undefined;
  const multiFactorError = error as MultiFactorError;
  const resolver = getMultiFactorResolver(auth, multiFactorError);
  return { errorCode: error.code, errorPayload: resolver };
};

export const authSignIn: AuthSignIn = (
  email: string,
  password: string,
  remember?: boolean,
) => () => {
  setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {})
    .catch((error: AuthError | { code: number }) => {
      console.log(error.code);
      const resolver = multiFactorResolver(error);
      if (resolver) return resolver;
      if (error.code === 18) return { errorCode: 'auth/web-storage-unsupported' };
      if (error.code === 'auth/user-not-found'
        || error.code === 'auth/wrong-password'
        || error.code === 'auth/too-many-requests'
        || error.code === 'auth/invalid-credential'
      ) {
        return { errorCode: error.code };
      }
      return handleCommonErrors(error);
    });
};

export const emailReauthentication: EmailReauthentication = (
  email: string,
  password: string,
) => () => {
  const credential = EmailAuthProvider.credential(email, password);
  return signInWithCredential(auth, credential)
    .then(() => {})
    .catch((error: AuthError | { code: number }) => {
      console.log(error.code);
      const resolver = multiFactorResolver(error);
      if (resolver) return resolver;
      if (error.code === 18) return { errorCode: 'auth/web-storage-unsupported' };
      if (error.code === 'auth/wrong-password') return { errorCode: error.code };
      if (error.code === 'auth/invalid-credential') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const sendSignLink: SendSignLink = (
  email: string,
  url: string,
  languageCode: string = 'en',
) => () => {
  auth.languageCode = languageCode;
  const actionCodeSettings = { url, handleCodeInApp: true };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => { })
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/quota-exceeded') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const resetPassword: ResetPassword = (
  email: string,
  url: string,
  languageCode: string = 'en',
) => () => {
  auth.languageCode = languageCode;
  const actionCodeSettings = { url, handleCodeInApp: true };
  return sendPasswordResetEmail(auth, email, actionCodeSettings)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/user-not-found') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const setPassword: SetPassword = (
  password: string,
) => () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  return updatePassword(user, password)
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/requires-recent-login') return { errorCode: error.code };
      if (error.code === 'auth/user-token-expired') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const checkEmailLink: CheckEmailLink = (
  emailLink: string,
) => isSignInWithEmailLink(auth, emailLink);

export const emailLinkSign: EmailLinkSign = (
  emailLink: string,
  email: string,
  remember?: boolean,
) => async () => {
  setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  const providers = await fetchSignInMethodsForEmail(auth, email)
    .catch(() => { const emptyArray: string[] = []; return emptyArray; });
  const passwordSet = providers.includes('password') && !providers.includes('emailLink');
  return signInWithEmailLink(auth, email, emailLink)
    .then(() => ({ payload: passwordSet }))
    .catch((error: AuthError | { code: number }) => {
      console.log(error.code);
      const resolver = multiFactorResolver(error);
      if (resolver) return resolver;
      if (error.code === 'auth/email-already-in-use') return { payload: passwordSet };
      if (error.code === 18) return { errorCode: 'auth/web-storage-unsupported' };
      if (error.code === 'auth/invalid-action-code'
      || error.code === 'auth/expired-action-code'
      || error.code === 'auth/invalid-email') {
        return { errorCode: error.code };
      }
      return handleCommonErrors(error);
    });
};

export const authSignOut: AuthSignOut = () => {
  console.log('User has Signed Out');
  return signOut(auth)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      return { errorCode: 'auth/server-error' };
    });
};

const buildProvider = (provider: 'google' | 'facebook' | 'twitter') => {
  if (provider === 'facebook') return new FacebookAuthProvider();
  if (provider === 'twitter') return new TwitterAuthProvider();
  return new GoogleAuthProvider();
};

const getSignInMethods = async (error: AuthError) => {
  const { email } = error.customData;
  if (email) {
    const providers = await fetchSignInMethodsForEmail(auth, email).catch(() => []);
    return providers.toString();
  }
  return undefined;
};

const singInWithProviderBuilder: SignInWithProviderBuilder = (
  provider: 'google' | 'facebook' | 'twitter',
  redirect: boolean,
  languageCode: string = 'en',
  email?: string,
) => () => {
  const authProvider = buildProvider(provider);
  auth.languageCode = languageCode;
  if (email) authProvider.setCustomParameters({ login_hint: email });
  return redirect
    ? signInWithRedirect(auth, authProvider)
      .then(() => {})
      .catch((error: AuthError | { code: number }) => {
        console.log(error.code);
        const resolver = multiFactorResolver(error);
        if (resolver) return resolver;
        if (error.code === 18) return { errorCode: 'auth/web-storage-unsupported' };
        return { errorCode: 'auth/server-error' };
      })
    : signInWithPopup(auth, authProvider)
      .then(() => {})
      .catch(async (error: AuthError) => {
        console.log(error.code);
        const resolver = multiFactorResolver(error);
        if (resolver) return resolver;
        if (error.code === 'auth/account-exists-with-different-credential') {
          const providers = await getSignInMethods(error);
          return { errorCode: error.code, errorPayload: providers };
        }
        if (error.code === 'auth/cancelled-popup-request') return { errorCode: error.code };
        if (error.code === 'auth/popup-blocked') return { errorCode: error.code };
        if (error.code === 'auth/popup-closed-by-user') return { errorCode: error.code };
        if (error.code === 'auth/internal-error') return { errorCode: error.code };
        return { errorCode: 'auth/server-error' };
      });
};

export const signInWithGoogle: SignInWithProvider = (
  redirect: boolean,
  languageCode: string,
  email?: string,
) => singInWithProviderBuilder('google', redirect, languageCode, email);

export const signInWithFacebook: SignInWithProvider = (
  redirect: boolean,
  languageCode: string,
  email?: string,
) => singInWithProviderBuilder('facebook', redirect, languageCode, email);

export const signInWithTwitter: SignInWithProvider = (
  redirect: boolean,
  languageCode: string,
  email?: string,
) => singInWithProviderBuilder('twitter', redirect, languageCode, email);

export const checkRedirectResult: GetRedirectResult = () => () => getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) return;
    throw new CustomAuthError();
  }).catch(async (error: AuthError | CustomAuthError) => {
    const resolver = multiFactorResolver(error);
    if (resolver) return resolver;
    if (error.code === 'auth/account-exists-with-different-credential') {
      const providers = await getSignInMethods(error);
      return { errorCode: error.code, errorPayload: providers };
    }
    if (error.code === 'auth/user-not-signed') return { errorCode: error.code };
    return { errorCode: 'auth/server-error' };
  });

export const updateUser: UpdateUser = (
  displayName: string,
  photoURL: Blob | string | null,
  displayNameProfanityFilter?: boolean,
  displayPictureProfanityFilter?: boolean,
) => () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  const { photoURL: actualPhotoURL, uid } = user;
  if (photoURL instanceof Blob) {
    return apiNameProfanityFilter(displayName, displayNameProfanityFilter)
      .then(() => imageProfanityFilter(photoURL, displayPictureProfanityFilter))
      .then(() => uploadUserDisplayPicture(uid, photoURL))
      .then((imageURL) => updateProfile(user, { displayName, photoURL: imageURL }))
      .catch((error: AuthError | CustomStorageError | ProfanityFilterError) => {
        console.log(error.code);
        if (error.code === 'storage/unauthorized') return { errorCode: error.code };
        if (error.code === 'storage/server-error') return { errorCode: error.code };
        if (error.code === 'storage/retry-limit-exceeded') return { errorCode: error.code };
        if (error.code === 'profanity-filter/nsfw-name') return { errorCode: error.code };
        if (error.code === 'profanity-filter/nsfw-image') return { errorCode: error.code };
        return handleCommonErrors(error);
      });
  }
  return apiNameProfanityFilter(displayName, displayNameProfanityFilter)
    .then(() => updateProfile(user, { displayName, photoURL: photoURL || '' }))
    .then(() => {
      if (actualPhotoURL) return deleteUserDisplayPicture(uid, actualPhotoURL);
      return undefined;
    })
    .catch((error: AuthError | CustomStorageError | ProfanityFilterError) => {
      console.log(error.code);
      if (error.code === 'storage/server-error') return { errorCode: error.code };
      if (error.code === 'profanity-filter/nsfw-name') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const visibleRecaptcha: VisibleRecaptcha = (
  setRecaptchaVerifier: (verifier: RecaptchaVerifier | undefined) => void,
  setSolvedCaptcha: (solvedCaptcha: boolean) => void,
  language: string,
) => {
  try {
    return React.useCallback((node: HTMLDivElement | null) => {
      if (node) {
        const verifier = new RecaptchaVerifier(auth, node, {
          hl: language,
          callback: () => { setSolvedCaptcha(true); },
          'expired-callback': () => { setSolvedCaptcha(false); },
          'error-callback': () => { setSolvedCaptcha(false); },
        });
        verifier.render();
        setRecaptchaVerifier(verifier);
      }
    }, []);
  } catch (error) {
    console.log(error);
  }
  return () => {};
};

export const invisibleRecaptcha: InvisibleRecaptcha = (
  setRecaptchaVerifier: (verifier: RecaptchaVerifier | undefined) => void,
) => React.useCallback((node: HTMLButtonElement | null) => {
  if (node) {
    const verifier = new RecaptchaVerifier(auth, node, {
      size: 'invisible',
    });
    setRecaptchaVerifier(verifier);
  }
}, []);

export const multiFactorAuthentication: MultiFactorAuthentication = (
  phoneNumber: string,
  languageCode: string,
  verifier?: RecaptchaVerifier,
) => () => {
  auth.languageCode = languageCode;
  if (!verifier) return Promise.resolve({ errorCode: 'auth/undefined-verifier' });
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  // await verifier.verify();
  return multiFactor(user).getSession()
    .then((session) => {
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      return phoneAuthProvider.verifyPhoneNumber({ phoneNumber, session }, verifier);
    })
    .then((verificationId) => ({ payload: verificationId }))
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/unverified-email') return { errorCode: error.code };
      if (error.code === 'auth/requires-recent-login') return { errorCode: error.code };
      if (error.code === 'auth/user-token-expired') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaPhoneEnrollment: MFAPhoneEnrollment = (
  verificationId: string,
  verificationCode: string,
  languageCode: string,
) => () => {
  auth.languageCode = languageCode;
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
  return multiFactor(user).enroll(multiFactorAssertion)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/invalid-verification-id') return { errorCode: error.code };
      if (error.code === 'auth/invalid-verification-code') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaPhonePreSignIn: MFAPhonePreSignIn = (
  phoneInfoOptions: PhoneInfoOptions,
  languageCode: string,
  verifier?: RecaptchaVerifier,
) => () => {
  auth.languageCode = languageCode;
  if (!verifier) return Promise.resolve({ errorCode: 'auth/undefined-verifier' });
  const phoneAuthProvider = new PhoneAuthProvider(auth);
  return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier)
    .then((verificationId) => ({ payload: verificationId }))
    .catch((error: AuthError) => {
      console.log(error.code);
      return handleCommonErrors(error);
    });
};

export const mfaPhonePostSignIn: MFAPhonePostSignIn = (
  resolver: MultiFactorResolver,
  verificationId: string,
  verificationCode: string,
) => () => {
  const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
  return resolver.resolveSignIn(multiFactorAssertion)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/invalid-verification-id') return { errorCode: error.code };
      if (error.code === 'auth/invalid-verification-code') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaUnenrollment: MFAUnenrollment = (
  factorType: 'phone' | 'totp',
) => () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  const { enrolledFactors } = multiFactor(user);
  const enrolledFactor = enrolledFactors.find((factor) => factor.factorId === factorType);
  if (!enrolledFactor) return Promise.resolve();
  return multiFactor(user).unenroll(enrolledFactor)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/requires-recent-login') return { errorCode: error.code };
      if (error.code === 'auth/user-token-expired') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaTotpGenerateSecret: MFATotpGenerateSecret = () => () => {
  const user = auth.currentUser;
  if (!user || !user.email) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  const { email } = user;
  return multiFactor(user).getSession()
    .then((session) => TotpMultiFactorGenerator.generateSecret(session))
    .then((totpSecret) => {
      const totpUri = totpSecret.generateQrCodeUrl(email, 'factored');
      return { payload: { totpUri, totpSecret } };
    })
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/requires-recent-login') return { errorCode: error.code };
      if (error.code === 'auth/user-token-expired') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaTotpEnrollment: MFATotpEnrollment = (
  totpSecret: TotpSecret,
  verificationCode: string,
  languageCode: string,
) => () => {
  auth.languageCode = languageCode;
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
    totpSecret,
    verificationCode,
  );
  return multiFactor(user).enroll(multiFactorAssertion, 'totp')
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      // if (error.code === 'auth/invalid-verification-id') return { errorCode: error.code };
      if (error.code === 'auth/invalid-verification-code') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const mfaTotpSignIn: MFATOTPSignIn = (
  resolver: MultiFactorResolver,
  otpUID: string,
  otpFromAuthenticator: string,
) => () => {
  const multiFactorAssertion = TotpMultiFactorGenerator
    .assertionForSignIn(otpUID, otpFromAuthenticator);
  return resolver.resolveSignIn(multiFactorAssertion)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/invalid-verification-code') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};

export const deleteAccount: DeleteAccount = () => () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve({ errorCode: 'auth/user-not-found' });
  return user.delete()
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.code);
      if (error.code === 'auth/requires-recent-login') return { errorCode: error.code };
      if (error.code === 'auth/user-token-expired') return { errorCode: error.code };
      return handleCommonErrors(error);
    });
};
