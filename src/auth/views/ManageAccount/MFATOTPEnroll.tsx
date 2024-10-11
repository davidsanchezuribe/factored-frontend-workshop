import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import {
  Button, IconButton, Tooltip, Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { TotpSecret } from 'firebase/auth';
import Center from '../../../materialui/Center';
import useLocalization from '../../../localization/useLocalization';
import { MFATotpEnrollment, MFATotpGenerateSecret } from '../../AuthManagerTypes';
import useFeedback from '../../../materialui/useFeedback';
import { maskText } from '../../../utilities';
import MFATOTPInputCode from '../MFATOTPInputCode';
import TOTPApps from '../TOTPApps';

declare global {
  interface Window {
    opera: string | undefined,
    MSStream: string | undefined,
  }
}

type MFATOTPEnrollProps = {
  mfaTotpGenerateSecret: MFATotpGenerateSecret,
  reauthenticate: (callback?: () => void) => () => void,
  mfaTotpEnrollment: MFATotpEnrollment,
  userRefresh: () => void,
};

const MFATOTPEnroll = ({
  mfaTotpGenerateSecret,
  reauthenticate,
  mfaTotpEnrollment,
  userRefresh,
}: MFATOTPEnrollProps) => {
  const { getMessages, getLanguage } = useLocalization();
  const language = getLanguage();
  const { mfaTotpEnroll: messages } = getMessages();
  const { fnHardHandler, toast } = useFeedback();
  const [totp, setTotp] = useState<{
    totpUri: string,
    totpSecret: TotpSecret,
  } | undefined>(undefined);
  const [showKey, setShowKey] = useState(false);
  const { totpUri, totpSecret } = totp || {};
  const secretKey = totpSecret?.secretKey;
  return (
    <>
      {totpUri
        ? (
          <>
            <Center><QRCode value={totpUri} size={192} /></Center>
            <Center>
              {secretKey && (
                <>
                  <Typography mt={1} variant="caption">{`${messages.secretKey}: ${showKey ? secretKey : maskText(secretKey)}`}</Typography>
                  <Tooltip title={showKey ? messages.hideSecretKey : messages.showSecretKey}>
                    <IconButton
                      size="small"
                      onClick={() => { setShowKey(!showKey); }}
                    >
                      {showKey ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={messages.clipboard}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(secretKey);
                        toast(messages.secretKeyCopied, 'success');
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Center>
          </>
        )
        : (
          <Center>
            <Button
              variant="contained"
              onClick={() => {
                const onSuccess = () => {
                  fnHardHandler(
                    mfaTotpGenerateSecret(),
                    {
                      setPayload: setTotp,
                      resolveError: {
                        'auth/requires-recent-login': reauthenticate(onSuccess),
                        'auth/user-token-expired': reauthenticate(onSuccess),
                      },
                    },
                  );
                };
                onSuccess();
              }}
            >
              {messages.generateQR}
            </Button>
          </Center>
        )}

      <Typography mt={2} mx={2}>{messages.downloadApp}</Typography>
      <TOTPApps />
      <Typography mt={2} mx={2}>{messages.scanCode}</Typography>
      {totpSecret && (
      <>
        <Typography mt={2} mx={2} mb={3}>{messages.enterCode}</Typography>
        <MFATOTPInputCode
          totpSecret={totpSecret}
          submitFunction={(
            totpCode: string,
            setSubmitting: (submitting: boolean) => void,
          ) => {
            if (!totpSecret) return;
            fnHardHandler(
              mfaTotpEnrollment(totpSecret, totpCode, language),
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
      )}

    </>
  );
};
export default MFATOTPEnroll;
