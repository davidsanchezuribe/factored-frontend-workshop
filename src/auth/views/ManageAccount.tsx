import React from 'react';
import { Grid, Typography } from '@mui/material';
import { WithAuthProps } from '../withAuthBuilder';
import Collapsible from '../../materialui/Collapsible';
import useLocalization from '../../localization/useLocalization';
import {
  VisibleRecaptcha,
  MultiFactorAuthentication,
  MFAPhoneEnrollment,
  SendSignLink,
  SetPassword,
  UpdateUser,
  MFAUnenrollment,
  MFATotpGenerateSecret,
  MFATotpEnrollment,
  DeleteAccount,
} from '../AuthManagerTypes';
import AccountVerification from './ManageAccount/AccountVerification';
import PasswordSet from './ManageAccount/PasswordSet';
import Preferences, { UserPreferences } from './ManageAccount/Preferences';
import CookiesStorage from './ManageAccount/CookiesStorage';
import TwoFactorAuthentication from './ManageAccount/TwoFactorAuthentication';
import { CountryCode } from '../AuthConfig';
import EraseAccount from './ManageAccount/EraseAccount';

type ManageAccountProps = {
  manageAccountPath: string,
  sendVerificationLink?: SendSignLink,
  setPassword?: SetPassword,
  manageAccount?: {
    cookiesStorageEnabler: boolean,
    preferredCountries: CountryCode[],
  },
  twoFactorAuthentication: boolean,
  userPreferences?: UserPreferences,
  updateUser?: UpdateUser,
  visibleRecaptcha?: VisibleRecaptcha,
  multiFactorAuthentication?: MultiFactorAuthentication,
  mfaPhoneEnrollment?: MFAPhoneEnrollment,
  mfaUnenrollment?: MFAUnenrollment,
  mfaTotpGenerateSecret?: MFATotpGenerateSecret,
  mfaTotpEnrollment?: MFATotpEnrollment,
  deleteAccount?: DeleteAccount,
};

const ManageAccount = ({
  manageAccountPath,
  sendVerificationLink,
  setPassword,
  manageAccount,
  twoFactorAuthentication,
  userPreferences,
  updateUser,
  visibleRecaptcha,
  multiFactorAuthentication,
  mfaPhoneEnrollment,
  mfaUnenrollment,
  mfaTotpGenerateSecret,
  mfaTotpEnrollment,
  deleteAccount,
  authUser,
  userRefresh,
}: ManageAccountProps & WithAuthProps) => {
  const { getMessages } = useLocalization();
  const { manageAccount: messages } = getMessages();
  const {
    email, emailVerified, displayName, photoURL, providers,
  } = authUser;
  const {
    cookiesStorageEnabler,
    preferredCountries,
  } = manageAccount || {};
  const preferencesComponent = updateUser && {
    title: messages.preferences,
    component: (
      <Preferences
        actualDisplayName={displayName}
        actualPhotoURL={photoURL}
        userPreferences={userPreferences}
        userRefresh={userRefresh}
        updateUser={updateUser}
      />
    ),
  };
  const setPasswordComponent = (setPassword)
    ? {
      title: messages.setPassword,
      component: (
        <PasswordSet
          authUser={authUser}
          userRefresh={userRefresh(0)}
          setPassword={setPassword}
        />
      ),
    } : undefined;
  const accountVerificationComponent = (sendVerificationLink && (providers.includes('password') || providers.includes('emailLink')) && email)
    ? {
      title: messages.accountVerification,
      component: (
        <AccountVerification
          email={email}
          emailVerified={emailVerified}
          manageAccountPath={manageAccountPath}
          sendVerificationLink={sendVerificationLink}
        />
      ),
    } : undefined;
  const twoFactorAuthenticationComponent = (
    email
    && visibleRecaptcha
    && multiFactorAuthentication
    && mfaPhoneEnrollment
    && mfaUnenrollment
    && mfaTotpGenerateSecret
    && mfaTotpEnrollment
    && sendVerificationLink
    && twoFactorAuthentication) ? {
      title: messages.twoFactorAuthentication,
      component: emailVerified ? (
        <TwoFactorAuthentication
          authUser={authUser}
          userRefresh={userRefresh(0)}
          preferredCountries={preferredCountries}
          visibleRecaptcha={visibleRecaptcha}
          multiFactorAuthentication={multiFactorAuthentication}
          mfaPhoneEnrollment={mfaPhoneEnrollment}
          mfaUnenrollment={mfaUnenrollment}
          mfaTotpGenerateSecret={mfaTotpGenerateSecret}
          mfaTotpEnrollment={mfaTotpEnrollment}
        />
      ) : (
        <AccountVerification
          email={email}
          emailVerified={emailVerified}
          manageAccountPath={manageAccountPath}
          sendVerificationLink={sendVerificationLink}
          mfa
        />
      ),
    } : undefined;
  const cookiesStorage = cookiesStorageEnabler ? {
    title: messages.cookiesStorage,
    component: <CookiesStorage />,
  } : undefined;
  const deleteAccountComponent = deleteAccount
    ? {
      title: messages.deleteAccount,
      component: <EraseAccount authUser={authUser} deleteAccount={deleteAccount} />,
    } : undefined;
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={10} md={7} lg={6}>
        <Typography mt={4} mb={3} variant="h5" align="center">
          {messages.title}
        </Typography>
        <Collapsible
          id="manageAccount"
          components={[
            preferencesComponent,
            setPasswordComponent,
            accountVerificationComponent,
            twoFactorAuthenticationComponent,
            cookiesStorage,
            deleteAccountComponent,
          ]}
          collapse
          mb={10}
        />
      </Grid>
    </Grid>
  );
};

export default ManageAccount;
