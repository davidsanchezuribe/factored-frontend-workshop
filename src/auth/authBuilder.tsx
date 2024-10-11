import React from 'react';
import {
  authSignIn,
  authSignUp,
  checkEmailLink,
  emailLinkSign,
  resetPassword,
  sendSignLink,
  setPassword,
  updateUser,
  visibleRecaptcha,
  multiFactorAuthentication,
  mfaPhoneEnrollment,
  mfaPhonePreSignIn,
  mfaPhonePostSignIn,
  mfaUnenrollment,
  mfaTotpGenerateSecret,
  mfaTotpEnrollment,
  mfaTotpSignIn,
  deleteAccount,
} from './authManager';
import EmailSignView from './views/EmailSign';
import LoginView from './views/Login';
import PasswordResetView from './views/PasswordReset';
import SignUpView from './views/SignUp';
import ManageAccountView from './views/ManageAccount';
import { WithAuthProps } from './withAuthBuilder';
import authConfig from '../authConfig';

const authBuilder = () => {
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
    },
    manageAccount,
    userPreferences,
    paths,
    paths: {
      loginPath,
      manageAccountPath,
      passwordResetPath,
      signUpPath,
    },
  } = authConfig;
  return {
    paths,
    EmailSign: emailLinkLogin
      ? ({ userRefresh }: { userRefresh: () => void }) => (
        <EmailSignView
          checkEmailLink={checkEmailLink}
          emailLinkSign={emailLinkSign}
          setPassword={passwordReset ? setPassword : undefined}
          userRefresh={userRefresh}
          visibleRecaptcha={visibleRecaptcha}
          mfaPhonePreSignIn={mfaPhonePreSignIn}
          mfaPhonePostSignIn={mfaPhonePostSignIn}
          mfaTotpSignIn={mfaTotpSignIn}
        />
      ) : undefined,
    Login: () => (
      <LoginView
        authSignIn={emailSignIn ? authSignIn : undefined}
        sendSignLink={emailLinkLogin ? sendSignLink : undefined}
        providers={[
          googleLogin ? 'google.com' : undefined,
          facebookLogin ? 'facebook.com' : undefined,
          twitterLogin ? 'twitter.com' : undefined,
        ]}
        hideSignUp={!emailSignUp}
        hidePasswordReset={!emailSignIn || !passwordReset}
        passwordResetPath={passwordResetPath}
        signUpPath={signUpPath}
        visibleRecaptcha={visibleRecaptcha}
        mfaPhonePreSignIn={mfaPhonePreSignIn}
        mfaPhonePostSignIn={mfaPhonePostSignIn}
        mfaTotpSignIn={mfaTotpSignIn}
      />
    ),
    PasswordReset: passwordReset && emailSignIn
      ? () => (
        <PasswordResetView
          resetPassword={resetPassword}
          hideSignUp={!emailSignUp}
          loginPath={loginPath}
          signUpPath={signUpPath}
          displaySocialNetworksMessage={googleLogin || facebookLogin || twitterLogin}
        />
      ) : undefined,
    SignUp: emailSignIn && emailSignUp
      ? () => (
        <SignUpView
          authSignUp={authSignUp}
          loginPath={loginPath}
          displaySocialNetworksMessage={googleLogin || facebookLogin || twitterLogin}
        />
      ) : undefined,
    ManageAccount: ({ authUser, userRefresh }: WithAuthProps) => (
      <ManageAccountView
        manageAccountPath={manageAccountPath}
        sendVerificationLink={emailSignIn || emailLinkLogin ? sendSignLink : undefined}
        setPassword={emailSignIn && passwordReset ? setPassword : undefined}
        manageAccount={manageAccount}
        twoFactorAuthentication={twoFactorAuthentication}
        userPreferences={userPreferences}
        updateUser={updateUser}
        authUser={authUser}
        userRefresh={userRefresh}
        visibleRecaptcha={visibleRecaptcha}
        multiFactorAuthentication={multiFactorAuthentication}
        mfaPhoneEnrollment={mfaPhoneEnrollment}
        mfaUnenrollment={mfaUnenrollment}
        mfaTotpGenerateSecret={mfaTotpGenerateSecret}
        mfaTotpEnrollment={mfaTotpEnrollment}
        deleteAccount={deleteAccount}
      />
    ),
  };
};

export default authBuilder;
