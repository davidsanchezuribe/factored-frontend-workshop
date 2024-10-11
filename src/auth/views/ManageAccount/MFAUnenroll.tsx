import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import useLocalization from '../../../localization/useLocalization';
import Center from '../../../materialui/Center';
import { MFAUnenrollment } from '../../AuthManagerTypes';
import useFeedback from '../../../materialui/useFeedback';
import { maskText } from '../../../utilities';
import TOTPApps from '../TOTPApps';

type MFAUnenrollProps = {
  enrolledPhone?: string,
  mfaUnenrollment: MFAUnenrollment,
  reauthenticate: (callback?: () => void) => () => void,
  userRefresh: () => void,
};

const MFAUnenroll = ({
  enrolledPhone,
  mfaUnenrollment,
  reauthenticate,
  userRefresh,
}: MFAUnenrollProps) => {
  const { getMessages } = useLocalization();
  const { mfaUnenroll: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  const [submitting, setSubmitting] = React.useState(false);
  return (
    <>
      { enrolledPhone ? (
        <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{`${messages.phoneDescription} ${maskText(enrolledPhone)}`}</Typography>
      ) : (
        <>
          <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{messages.totpDescription}</Typography>
          <TOTPApps />
          <Box mb={1} />
        </>
      )}
      <Center>
        <Button
          variant="contained"
          disabled={submitting}
          onClick={() => {
            const onSuccess = () => {
              fnHardHandler(
                mfaUnenrollment(enrolledPhone ? 'phone' : 'totp'),
                {
                  errorMessages: messages.errors,
                  resolveError: {
                    'auth/requires-recent-login': reauthenticate(onSuccess),
                    'auth/user-token-expired': reauthenticate(onSuccess),
                  },
                  onSuccessMessage: enrolledPhone
                    ? messages.unenrolledPhoneMFA : messages.unenrolledTotpMFA,
                  onSuccess: userRefresh,
                  setSubmitting,
                  keepSubmittingOnSuccess: true,
                },
              );
            };
            onSuccess();
          }}
        >
          {enrolledPhone ? messages.disablePhoneMFA : messages.disableTotpMFA}
        </Button>
      </Center>
    </>
  );
};

export default MFAUnenroll;
