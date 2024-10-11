import {
  AuthError, MultiFactorResolver, PhoneInfoOptions, RecaptchaVerifier,
  TotpSecret,
} from 'firebase/auth';
import { HardHandlerPromise } from '../materialui/useFeedback';

export class CustomAuthError extends Error {
  code: 'auth/user-not-signed';

  constructor() {
    super();
    this.code = 'auth/user-not-signed';
  }
}
type CommonErrors = 'auth/network-request-failed' | 'auth/server-error';

export type AuthUser = {
  email: string | null,
  idToken: string | null,
  displayName: string | null,
  photoURL: string | null,
  emailVerified: boolean,
  providers: string[],
  enrolledPhone: string | null,
  enrolledTotp: boolean,
  lastSignInTime: number | undefined,
};

export type AuthObserver = (setAuthUser: (authUser: AuthUser | null) => void) => (() => void);

export type AuthSignUp = (
  email: string,
  password: string,
  remember?: boolean,
) => HardHandlerPromise<'auth/web-storage-unsupported' | 'auth/email-already-in-use' | CommonErrors>;

export type MFAResolver = (
  error: AuthError | CustomAuthError | { code: number }
) => ({ errorCode: 'auth/multi-factor-auth-required', errorPayload: MultiFactorResolver } | undefined);

export type AuthSignIn = (
  email: string,
  password: string,
  remember?: boolean,
) => HardHandlerPromise<'auth/web-storage-unsupported' | 'auth/invalid-credential' | 'auth/user-not-found' | 'auth/wrong-password' | 'auth/too-many-requests' | 'auth/multi-factor-auth-required' | CommonErrors>;

export type EmailReauthentication = (
  email: string,
  password: string,
) => HardHandlerPromise<'auth/multi-factor-auth-required' | 'auth/web-storage-unsupported' | 'auth/wrong-password' | 'auth/invalid-credential' | CommonErrors>;

export type SendSignLink = (
  email: string,
  url: string,
  languageCode?: string,
) => HardHandlerPromise<'auth/quota-exceeded' | CommonErrors>;

export type ResetPassword = (
  email: string,
  url: string,
  languageCode?: string,
) => HardHandlerPromise<'auth/user-not-found' | CommonErrors>;

export type SetPassword = (
  password: string,
) => HardHandlerPromise<'auth/user-not-found' | 'auth/user-token-expired' | 'auth/requires-recent-login' | CommonErrors>;

export type CheckEmailLink = (emailLink: string) => boolean;

export type EmailLinkSign = (
  emailLink: string,
  email: string,
  remember?: boolean,
) => HardHandlerPromise<'auth/web-storage-unsupported' | 'auth/invalid-action-code' | 'auth/expired-action-code' | 'auth/invalid-email' | 'auth/multi-factor-auth-required' | CommonErrors, boolean>;

export type AuthSignOut = HardHandlerPromise<'auth/server-error'>;

type ProviderErrorCodes = 'auth/multi-factor-auth-required' | 'auth/account-exists-with-different-credential' | 'auth/web-storage-unsupported' | 'auth/popup-blocked' | 'auth/cancelled-popup-request' | 'auth/popup-closed-by-user' | 'auth/server-error' | 'auth/internal-error';

export type SignInWithProviderBuilder = (
  provider: 'google' | 'facebook' | 'twitter',
  redirect: boolean,
  languageCode: string,
  email?: string,
) => HardHandlerPromise<ProviderErrorCodes>;

export type SignInWithProvider = (
  redirect: boolean,
  languageCode: string,
  email?: string,
) => HardHandlerPromise<ProviderErrorCodes>;

export type GetRedirectResult = () => HardHandlerPromise<'auth/multi-factor-auth-required' | 'auth/user-not-signed' | 'auth/account-exists-with-different-credential' | 'auth/server-error'>;

export type UpdateUser = (
  displayName: string,
  displayPicture: Blob | string | null,
  displayNameProfanityFilter?: boolean,
  displayPictureProfanityFilter?: boolean,
) => HardHandlerPromise<'auth/user-not-found' | 'storage/server-error' | 'auth/server-error' | 'storage/unauthorized' | 'storage/retry-limit-exceeded' | 'profanity-filter/nsfw-name' | 'profanity-filter/nsfw-image' | CommonErrors>;

export type GetCurrentUser = () => HardHandlerPromise<'auth/server-error'>;

export type VisibleRecaptcha = (
  setRecaptchaVerifier: (verifier: RecaptchaVerifier | undefined) => void,
  setSolvedCaptcha: (solvedCaptcha: boolean) => void,
  language: string,
) => (node: HTMLDivElement | null) => void;

export type InvisibleRecaptcha = (
  setRecaptchaVerifier: (verifier: RecaptchaVerifier | undefined) => void,
) => (node: HTMLButtonElement | null) => void;

export type MultiFactorAuthentication = (
  phoneNumber: string,
  languageCode: string,
  verifier?: RecaptchaVerifier,
) => HardHandlerPromise<'auth/undefined-verifier' | 'auth/user-not-found' | 'auth/unverified-email' | 'auth/user-token-expired' | 'auth/requires-recent-login' | CommonErrors, string>;

export type MFAPhoneEnrollment = (
  verificationId: string,
  verificationCode: string,
  languageCode: string,
) => HardHandlerPromise<'auth/user-not-found' | 'auth/invalid-verification-id' | 'auth/invalid-verification-code' | CommonErrors>;

export type MFAPhonePreSignIn = (
  phoneInfoOptions: PhoneInfoOptions,
  languageCode: string,
  verifier?: RecaptchaVerifier,
) => HardHandlerPromise<'auth/undefined-verifier' | CommonErrors, string>;

export type MFAPhonePostSignIn = (
  resolver: MultiFactorResolver,
  verificationId: string,
  verificationCode: string,
) => HardHandlerPromise<'auth/invalid-verification-id' | 'auth/invalid-verification-code' | CommonErrors>;

export type MFAUnenrollment = (
  factorType: 'phone' | 'totp',
) => HardHandlerPromise<'auth/user-not-found' | 'auth/user-token-expired' | 'auth/requires-recent-login' | CommonErrors>;

export type MFATotpGenerateSecret = (
) => HardHandlerPromise<'auth/user-not-found' | 'auth/user-token-expired' | 'auth/requires-recent-login' | CommonErrors, { totpUri: string, totpSecret: TotpSecret }>;

export type MFATotpEnrollment = (
  totpSecret: TotpSecret,
  verificationCode: string,
  languageCode: string,
) => HardHandlerPromise<'auth/user-not-found' | 'auth/invalid-verification-code' | CommonErrors>;

export type MFATOTPSignIn = (
  resolver: MultiFactorResolver,
  otpUID: string,
  otpFromAuthenticator: string,
) => HardHandlerPromise<'auth/invalid-verification-code' | CommonErrors>;

export type DeleteAccount = () => HardHandlerPromise<'storage/unauthorized' | 'storage/server-error' | 'auth/user-not-found' | 'auth/user-token-expired' | 'auth/requires-recent-login' | CommonErrors>;
