import React from 'react';
import { MultiFactorResolver } from 'firebase/auth';
import { Box, Typography } from '@mui/material';
import MFATOTPInputCode from './MFATOTPInputCode';
import useFeedback from '../../materialui/useFeedback';
import useLocalization from '../../localization/useLocalization';
import { MFATOTPSignIn } from '../AuthManagerTypes';
import TOTPApps from './TOTPApps';

type MFATOTPLoginProps = {
  resolver: MultiFactorResolver,
  otpUID: string,
  onSuccess?: () => void,
  onSuccessMessage?: string,
  mfaTotpSignIn: MFATOTPSignIn,
};

const MFATOTPLogin = ({
  resolver,
  otpUID,
  onSuccess,
  onSuccessMessage,
  mfaTotpSignIn,
}: MFATOTPLoginProps) => {
  const { getMessages } = useLocalization();
  const { mfaLogin: { totp: messages } } = getMessages();
  const { fnHardHandler } = useFeedback();
  return (
    <>
      <Typography mx={2} align="center" mb={2}>{messages.enterCode}</Typography>
      <TOTPApps />
      <Box mb={2} />
      <MFATOTPInputCode
        totpSecret
        submitFunction={(
          totpCode: string,
          setSubmitting: (submitting: boolean) => void,
        ) => {
          fnHardHandler(
            mfaTotpSignIn(resolver, otpUID, totpCode),
            {
              onSuccess,
              setSubmitting,
              errorMessages: messages.errors,
              keepSubmittingOnSuccess: true,
              onSuccessMessage,
            },
          );
        }}
      />
      <Box mb={1} />
    </>
  );
};

export default MFATOTPLogin;
