import React, { useState } from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import useLocalization from '../../../localization/useLocalization';
import FormField from '../../../materialui/FormField';
import useFeedback from '../../../materialui/useFeedback';
import { SendSignLink } from '../../AuthManagerTypes';
import { useSetting } from '../../../settings/withSettings';
import { getRootPath } from '../../../utilities';

type AccountVerificationProps = {
  email: string,
  emailVerified: boolean,
  manageAccountPath: string,
  sendVerificationLink: SendSignLink,
  mfa?: boolean,
};

const AccountVerification = ({
  email,
  emailVerified,
  manageAccountPath,
  sendVerificationLink,
  mfa,
}: AccountVerificationProps) => {
  const { getLanguage, getMessages } = useLocalization();
  const languageCode = getLanguage();
  const { accountVerification: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  if (emailVerified) return <Alert severity="success">{messages.verifiedEmail}</Alert>;
  const { useBooleanSetting, useStringNullableSetting } = useSetting();
  const [rememberSetting] = useBooleanSetting('remember');
  const [, setEmailForSignIn] = useStringNullableSetting('emailForSignIn');
  const [isSubmitting, setSubmitting] = useState(false);
  const sendLink = () => {
    fnHardHandler(
      sendVerificationLink(
        email,
        `${getRootPath()}${manageAccountPath}?remember=${rememberSetting}&${mfa ? 'mfaverificating' : 'verificating'}=true`,
        languageCode,
      ),
      {
        errorMessages: messages.errors,
        onSuccess: () => { setEmailForSignIn(email); },
        onSuccessMessage: `${messages.sentMail} ${email}`,
        setSubmitting,
        keepSubmittingOnSuccess: true,
      },
    );
  };
  return (
    <>
      <Alert severity="warning">
        <AlertTitle>{messages.notVerifiedEmailTitle}</AlertTitle>
        {mfa ? messages.notVerifiedEmailMFAMessage : messages.notVerifiedEmailDefaultMessage}
      </Alert>
      <FormField mt={1.5}>
        <Button
          variant="contained"
          color="warning"
          disabled={isSubmitting}
          size="small"
          onClick={sendLink}
        >
          {messages.sendLink}
        </Button>
      </FormField>
    </>
  );
};

AccountVerification.defaultProps = {
  mfa: undefined,
};

export default AccountVerification;
