import React from 'react';
import { CountryCode } from '../../AuthConfig';
import {
  AuthUser,
  VisibleRecaptcha,
  MultiFactorAuthentication,
  MFAPhoneEnrollment,
  MFAUnenrollment,
  MFATotpGenerateSecret,
  MFATotpEnrollment,
} from '../../AuthManagerTypes';
import MFAPhoneEnroll from './MFAPhoneEnroll';
import MFAUnenroll from './MFAUnenroll';
import useLocalization from '../../../localization/useLocalization';
import MFATOTPEnroll from './MFATOTPEnroll';
import Reauthentication, { useReauthentication } from '../Reauthentication';
import { useSetting } from '../../../settings/withSettings';
import MFASwitch from '../MFASwitch';

type TwoFactorAuthenticationProps = {
  authUser: AuthUser,
  userRefresh: () => void,
  preferredCountries?: CountryCode[],
  visibleRecaptcha: VisibleRecaptcha,
  multiFactorAuthentication: MultiFactorAuthentication,
  mfaPhoneEnrollment: MFAPhoneEnrollment,
  mfaUnenrollment: MFAUnenrollment,
  mfaTotpGenerateSecret: MFATotpGenerateSecret,
  mfaTotpEnrollment: MFATotpEnrollment,
};

const TwoFactorAuthentication = ({
  authUser,
  userRefresh,
  preferredCountries,
  visibleRecaptcha,
  multiFactorAuthentication,
  mfaPhoneEnrollment,
  mfaUnenrollment,
  mfaTotpGenerateSecret,
  mfaTotpEnrollment,
}: TwoFactorAuthenticationProps) => {
  const { enrolledPhone, enrolledTotp } = authUser;
  const { getMessages } = useLocalization();
  const { twoFactorAuthentication: messages } = getMessages();
  const { useBooleanSetting } = useSetting();
  const [phoneOrTOTP, setPhoneOrTOTP] = useBooleanSetting('phoneOrTOTP', false);
  const {
    openModal, setOpenModal, onSuccess, reauthenticate,
  } = useReauthentication();
  const content = () => {
    if (phoneOrTOTP) {
      if (enrolledTotp) {
        return (
          <MFAUnenroll
            mfaUnenrollment={mfaUnenrollment}
            reauthenticate={reauthenticate}
            userRefresh={userRefresh}
          />
        );
      }
      return (
        <MFATOTPEnroll
          mfaTotpGenerateSecret={mfaTotpGenerateSecret}
          reauthenticate={reauthenticate}
          userRefresh={userRefresh}
          mfaTotpEnrollment={mfaTotpEnrollment}
        />
      );
    }
    if (enrolledPhone) {
      return (
        <MFAUnenroll
          enrolledPhone={enrolledPhone}
          mfaUnenrollment={mfaUnenrollment}
          reauthenticate={reauthenticate}
          userRefresh={userRefresh}
        />
      );
    }
    return (
      <MFAPhoneEnroll
        preferredCountries={preferredCountries}
        visibleRecaptcha={visibleRecaptcha}
        multiFactorAuthentication={multiFactorAuthentication}
        mfaPhoneEnrollment={mfaPhoneEnrollment}
        reauthenticate={reauthenticate}
        userRefresh={userRefresh}
      />
    );
  };
  return (
    <>
      <MFASwitch phoneOrTOTP={phoneOrTOTP} setPhoneOrTOTP={setPhoneOrTOTP} />
      {content()}
      <Reauthentication
        authUser={authUser}
        openModal={openModal}
        setOpenModal={setOpenModal}
        successMessage={!phoneOrTOTP && !enrolledPhone
          ? messages.enrollReauthenticated : undefined}
        emailHint={phoneOrTOTP || !enrolledPhone ? 'enroll' : 'unenroll'}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default TwoFactorAuthentication;
