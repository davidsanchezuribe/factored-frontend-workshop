import React from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';
import { RecaptchaVerifier } from 'firebase/auth';
import useLocalization from '../../../localization/useLocalization';
import Center from '../../../materialui/Center';
import useCountdown from '../../../materialui/useCountdown';
import {
  VisibleRecaptcha, MultiFactorAuthentication, MFAPhoneEnrollment,
} from '../../AuthManagerTypes';
import { CountryCode } from '../../AuthConfig';
import MFAPhoneInputCode from '../MFAPhoneInputCode';
import useFeedback from '../../../materialui/useFeedback';

type MFAPhoneEnrollProps = {
  preferredCountries?: CountryCode[],
  visibleRecaptcha: VisibleRecaptcha,
  multiFactorAuthentication: MultiFactorAuthentication,
  mfaPhoneEnrollment: MFAPhoneEnrollment,
  reauthenticate: (callback?: () => void) => () => void,
  userRefresh: () => void,
};

const MFAPhoneEnroll = ({
  preferredCountries = ['CO'],
  visibleRecaptcha,
  multiFactorAuthentication,
  mfaPhoneEnrollment,
  reauthenticate,
  userRefresh,
}: MFAPhoneEnrollProps) => {
  const { getMessages, getLanguage } = useLocalization();
  const { mfaPhoneEnroll: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  const language = getLanguage();
  const [verifier, setVerifier] = React.useState<RecaptchaVerifier | undefined>();
  const [phone, setPhone] = React.useState('');
  const [verificationId, setVerificationId] = React.useState<string | undefined>();
  const [solvedCaptcha, setSolvedCaptcha] = React.useState(false);
  const {
    disable, enable, disabled, timeLeft, progress,
  } = useCountdown(60, false);
  const validPhone = matchIsValidTel(phone);
  return (
    <>
      <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{messages.description}</Typography>
      <Center>
        <Box ref={visibleRecaptcha(setVerifier, setSolvedCaptcha, language)} mb={2} />
      </Center>
      <Center>
        <Stack direction="row" alignItems="top" spacing={1}>
          <MuiTelInput
            label={messages.phone.label}
            value={phone}
            onChange={(newPhone) => { setPhone(newPhone); }}
            preferredCountries={preferredCountries}
            defaultCountry={preferredCountries[0]}
            sx={{ mr: 1 }}
          />
          <Tooltip
            title={(() => {
              if (!validPhone) return messages.phone.notValid;
              if (!solvedCaptcha) return messages.phone.notSolvedCaptcha;
              if (disabled) return `${messages.phone.wait} ${timeLeft}`;
              return undefined;
            })()}
            arrow
          >
            <span>
              <Button
                variant="contained"
                disabled={!validPhone || disabled || !solvedCaptcha}
                sx={{ height: disabled ? '95%' : '100%' }}
                onClick={() => {
                  disable();
                  const trimmedPhone = phone.replace(/\s/g, '');
                  const onSuccess = () => {
                    fnHardHandler(multiFactorAuthentication(trimmedPhone, language, verifier), {
                      setPayload: setVerificationId,
                      onSuccess: disable,
                      onSuccessMessage: messages.phone.sendedSMS,
                      onError: () => { setSolvedCaptcha(false); enable(); },
                      errorMessages: messages.errors,
                      resolveError: {
                        'auth/requires-recent-login': reauthenticate(onSuccess),
                        'auth/user-token-expired': reauthenticate(onSuccess),
                      },
                    });
                  };
                  onSuccess();
                }}
              >
                {messages.phone.sendSMS}
              </Button>
              {disabled && <LinearProgress color="primary" variant="determinate" value={progress} sx={{ height: '5%' }} />}
            </span>
          </Tooltip>
        </Stack>
      </Center>
      <MFAPhoneInputCode
        verificationId={verificationId}
        submitFunction={(
          smsCode: string,
          setSubmitting: (submitting: boolean) => void,
        ) => {
          if (!verificationId) return;
          fnHardHandler(
            mfaPhoneEnrollment(verificationId, smsCode, language),
            {
              setSubmitting,
              onSuccessMessage: messages.enrolled,
              errorMessages: messages.errors,
              onSuccess: userRefresh,
              keepSubmittingOnSuccess: true,
            },
          );
        }}
      />
    </>
  );
};

export default MFAPhoneEnroll;
