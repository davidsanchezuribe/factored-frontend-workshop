import React from 'react';
import {
  MultiFactorInfo, MultiFactorResolver, MultiFactorSession, RecaptchaVerifier,
} from 'firebase/auth';
import {
  Box, Button, LinearProgress, Tooltip, Typography,
} from '@mui/material';
import { MFAPhonePostSignIn, MFAPhonePreSignIn, VisibleRecaptcha } from '../AuthManagerTypes';
import Center from '../../materialui/Center';
import useLocalization from '../../localization/useLocalization';
import useCountdown from '../../materialui/useCountdown';
import MFAPhoneInputCode from './MFAPhoneInputCode';
import useFeedback from '../../materialui/useFeedback';

type MFAPhoneLoginProps = {
  visibleRecaptcha: VisibleRecaptcha,
  multiFactorHint: MultiFactorInfo,
  session: MultiFactorSession,
  resolver: MultiFactorResolver,
  mfaPhonePreSignIn: MFAPhonePreSignIn,
  mfaPhonePostSignIn: MFAPhonePostSignIn,
  onSuccess?: () => void,
  onSuccessMessage?: string,
};

const MFAPhoneLogin = ({
  visibleRecaptcha,
  multiFactorHint,
  session,
  resolver,
  mfaPhonePreSignIn,
  mfaPhonePostSignIn,
  onSuccess,
  onSuccessMessage,
}: MFAPhoneLoginProps) => {
  const { getLanguage, getMessages } = useLocalization();
  const { mfaLogin: { phone: messages } } = getMessages();
  const language = getLanguage();
  const { fnHardHandler } = useFeedback();
  const [verifier, setVerifier] = React.useState<RecaptchaVerifier | undefined>();
  const [verificationId, setVerificationId] = React.useState<string | undefined>();
  const [solvedCaptcha, setSolvedCaptcha] = React.useState(false);
  const {
    disable, enable, disabled, timeLeft, progress,
  } = useCountdown(60, false);
  const phoneNumber = 'phoneNumber' in multiFactorHint && typeof multiFactorHint.phoneNumber === 'string'
    ? multiFactorHint.phoneNumber : undefined;
  const description = phoneNumber ? `${messages.description.prefix} ${phoneNumber} ${messages.description.suffix}` : undefined;
  return (
    <>
      {description && <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{description}</Typography>}
      <Center>
        <Box ref={visibleRecaptcha(setVerifier, setSolvedCaptcha, language)} mb={2} />
      </Center>
      <Center>
        <Tooltip
          title={(() => {
            if (disabled) return `${messages.wait} ${timeLeft}`;
            if (!solvedCaptcha) return messages.notSolvedCaptcha;
            return undefined;
          })()}
          arrow
        >
          <span>
            <Button
              variant="contained"
              disabled={disabled || !solvedCaptcha}
              sx={{ height: disabled ? '95%' : '100%' }}
              onClick={() => {
                disable();
                fnHardHandler(mfaPhonePreSignIn({ multiFactorHint, session }, language, verifier), {
                  setPayload: setVerificationId,
                  onSuccess: () => { disable(); setSolvedCaptcha(false); },
                  onSuccessMessage: messages.sendedSMS,
                  onError: () => { setSolvedCaptcha(false); enable(); },
                  errorMessages: messages.errors,
                });
              }}
            >
              {messages.sendSMS}
            </Button>
            {disabled && <LinearProgress color="primary" variant="determinate" value={progress} sx={{ height: '5%' }} />}
          </span>
        </Tooltip>
      </Center>
      <MFAPhoneInputCode
        verificationId={verificationId}
        submitFunction={(
          smsCode: string,
          setSubmitting: (submitting: boolean) => void,
        ) => {
          if (!verificationId) return;
          fnHardHandler(
            mfaPhonePostSignIn(resolver, verificationId, smsCode),
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
    </>
  );
};

MFAPhoneLogin.defaultProps = {
  onSuccess: undefined,
  onSuccessMessage: undefined,
};

export default MFAPhoneLogin;
