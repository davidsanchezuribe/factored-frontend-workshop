// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import { MultiFactorInfo, MultiFactorResolver, MultiFactorSession } from 'firebase/auth';
import { Box, Typography } from '@mui/material';
import {
  MFAPhonePostSignIn, MFAPhonePreSignIn, MFATOTPSignIn, VisibleRecaptcha,
} from '../AuthManagerTypes';
import useLocalization from '../../localization/useLocalization';
import FormLayout from '../../materialui/FormLayout';
import MFAPhoneLogin from './MFAPhoneLogin';
import MFATOTPLogin from './MFATOTPLogin';
import { useSetting } from '../../settings/withSettings';
import MFASwitch from './MFASwitch';

type MFALoginProps = {
  resolver: MultiFactorResolver,
  visibleRecaptcha?: VisibleRecaptcha,
  mfaPhonePreSignIn?: MFAPhonePreSignIn,
  mfaPhonePostSignIn?: MFAPhonePostSignIn,
  mfaTotpSignIn?: MFATOTPSignIn,
  hideLayout?: boolean,
  onSuccess?: () => void,
  onSuccessMessage?: string,
};

const MFALogin = ({
  resolver,
  visibleRecaptcha,
  mfaPhonePreSignIn,
  mfaPhonePostSignIn,
  hideLayout,
  onSuccess,
  onSuccessMessage,
  mfaTotpSignIn,
}: MFALoginProps) => {
  const { getMessages } = useLocalization();
  const { mfaLogin: messages } = getMessages();
  const { hints } = resolver;
  const { useBooleanSetting } = useSetting();
  const [phoneOrTOTP, setPhoneOrTOTP] = useBooleanSetting('phoneOrTOTP', false);
  const [phoneMFA, setPhoneMFA] = React.useState<{
    multiFactorHint: MultiFactorInfo,
    session: MultiFactorSession
  } | undefined>(undefined);
  const [otpUID, setOtpUID] = React.useState<string | undefined>(undefined);
  useEffect(() => {
    for (let i = 0; i < hints.length; i += 1) {
      const hint = hints[i];
      if (hint.factorId === 'phone') {
        setPhoneMFA({ multiFactorHint: hint, session: resolver.session });
      }
      if (hint.factorId === 'totp') setOtpUID(hint.uid);
    }
  }, []);
  const content = () => {
    if (
      phoneMFA
      && (!otpUID || !phoneOrTOTP)
      && visibleRecaptcha
      && mfaPhonePreSignIn
      && mfaPhonePostSignIn
    ) {
      return (
        <MFAPhoneLogin
          resolver={resolver}
          mfaPhonePreSignIn={mfaPhonePreSignIn}
          mfaPhonePostSignIn={mfaPhonePostSignIn}
          visibleRecaptcha={visibleRecaptcha}
          multiFactorHint={phoneMFA.multiFactorHint}
          session={phoneMFA.session}
          onSuccess={onSuccess}
          onSuccessMessage={onSuccessMessage}
        />
      );
    }
    if (
      otpUID
      && (!phoneMFA || phoneOrTOTP)
      && mfaTotpSignIn
    ) {
      return (
        <MFATOTPLogin
          otpUID={otpUID}
          resolver={resolver}
          mfaTotpSignIn={mfaTotpSignIn}
        />
      );
    }
    return null;
  };
  const sw = () => {
    if (phoneMFA && otpUID) {
      return (
        <MFASwitch phoneOrTOTP={phoneOrTOTP} setPhoneOrTOTP={setPhoneOrTOTP} />
      );
    }
    return undefined;
  };
  return hideLayout
    ? (
      <Box mt={2} mb={5} mx={2}>
        <Typography variant="h5" align="center" sx={{ mt: 3, mb: 2 }}>{messages.title}</Typography>
        {sw()}
        {content()}
      </Box>
    ) : (
      <FormLayout title={messages.title}>
        {sw()}
        {content()}
      </FormLayout>
    );
};

MFALogin.defaultProps = {
  visibleRecaptcha: undefined,
  mfaPhonePreSignIn: undefined,
  mfaPhonePostSignIn: undefined,
  mfaTotpSignIn: undefined,
  hideLayout: undefined,
  onSuccess: undefined,
  onSuccessMessage: undefined,
};

export default MFALogin;
