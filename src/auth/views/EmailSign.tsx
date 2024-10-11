import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Dialog, Grid, IconButton, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MultiFactorResolver } from 'firebase/auth';
import Modal from '../../materialui/Modal';
import useFeedback from '../../materialui/useFeedback';
import InputTextFMUI from '../../materialui/InputFieldFMUI';
import useLocalization from '../../localization/useLocalization';
import {
  CheckEmailLink,
  EmailLinkSign,
  MFAPhonePostSignIn,
  MFAPhonePreSignIn,
  MFATOTPSignIn,
  SetPassword,
  VisibleRecaptcha,
} from '../AuthManagerTypes';
import { useSetting } from '../../settings/withSettings';
import isLocalStorageAvailable from './isLocalStorageAvailable';
import PasswordSet from './ManageAccount/PasswordSet';
import Center from '../../materialui/Center';
import MFALogin from './MFALogin';

type EmailSignProps = {
  checkEmailLink: CheckEmailLink,
  emailLinkSign: EmailLinkSign,
  setPassword?: SetPassword,
  userRefresh: () => void,
  visibleRecaptcha?: VisibleRecaptcha,
  mfaPhonePreSignIn?: MFAPhonePreSignIn,
  mfaPhonePostSignIn?: MFAPhonePostSignIn,
  mfaTotpSignIn?: MFATOTPSignIn,
};

type FormValues = {
  emailToSign: string,
};

const link = window.location.href;
const urlParams = new URLSearchParams(window.location.search);

const EmailSign = ({
  checkEmailLink,
  emailLinkSign,
  setPassword,
  userRefresh,
  visibleRecaptcha,
  mfaPhonePreSignIn,
  mfaPhonePostSignIn,
  mfaTotpSignIn,
}: EmailSignProps) => {
  const { getMessages } = useLocalization();
  const { emailSign: messages } = getMessages();
  const { useStringNullableSetting } = useSetting();
  const { toast, fnHardHandler } = useFeedback();
  const [emailForSignIn, setEmailForSignIn, removeEmailForSignIn] = useStringNullableSetting('emailForSignIn');
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [usedLink, setUsedLink] = useState(false);
  const onSuccessMessage = (() => {
    if (urlParams.get('verificating') === 'true') return messages.verificatedPrefix + emailForSignIn + messages.verificatedSuffix;
    if (urlParams.get('mfaverificating') === 'true') return messages.mfaVerificated;
    if (urlParams.get('enroll') === 'true') return messages.enrollReauthenticated;
    if (urlParams.get('unenroll') === 'true') return messages.unenrollReauthenticated;
    if (urlParams.get('setpassword') === 'true') return messages.setpasswordReauthenticated;
    if (urlParams.get('delete') === 'true') return messages.deleteReauthenticated;
    return undefined;
  })();
  const [passwordSet, setPasswordSet] = useState(false);
  const [resolver, setResolver] = useState<MultiFactorResolver | undefined>(undefined);
  useEffect(() => {
    if (!checkEmailLink(link) || usedLink) return;
    if (!isLocalStorageAvailable()) {
      toast(messages.errors['auth/web-storage-unsupported'], 'error');
      return;
    }
    if (!emailForSignIn) {
      setOpenEmailDialog(true);
    } else {
      const remember = urlParams.get('remember');
      fnHardHandler(
        emailLinkSign(link, emailForSignIn, remember === 'true'),
        {
          errorMessages: messages.errors,
          setPayload: setPasswordSet,
          onSuccess: () => { setUsedLink(true); userRefresh(); removeEmailForSignIn(); },
          onSuccessMessage,
          resolveError: {
            'auth/multi-factor-auth-required': (authResolver) => { setResolver(authResolver as MultiFactorResolver); setUsedLink(true); removeEmailForSignIn(); },
            'auth/expired-action-code': { fn: () => { setUsedLink(true); removeEmailForSignIn(); }, toast: true },
            'auth/invalid-action-code': { fn: () => { setUsedLink(true); removeEmailForSignIn(); }, toast: true },
            'auth/invalid-email': { fn: removeEmailForSignIn, toast: true },
          },
        },
      );
    }
  }, [emailForSignIn]);
  const initialValues: FormValues = {
    emailToSign: '',
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          emailToSign: Yup.string().email(messages.email.valid).required(messages.email.required),
        })}
        onSubmit={({ emailToSign }) => {
          setEmailForSignIn(emailToSign);
        }}
      >
        {({ isValid, handleSubmit, setTouched }) => (
          <Form>
            <Modal
              open={openEmailDialog}
              setOpen={setOpenEmailDialog}
              title="Confirme su email para continuar"
              centerTitle
              preventClose
              positiveAction={{
                isValid,
                handleSubmit,
                setTouched: () => { setTouched({ emailToSign: true }); },
              }}
            >
              <Grid item xs={12} sm={10}>
                <InputTextFMUI
                  variant="standard"
                  name="emailToSign"
                  label={messages.email.label}
                  required
                  fullWidth
                />
              </Grid>
            </Modal>
          </Form>
        )}
      </Formik>
      { setPassword && (
      <Dialog
        open={passwordSet}
        onClose={setPasswordSet}
        maxWidth="md"
        fullWidth
      >
        <IconButton
          aria-label="close"
          onClick={() => { setPasswordSet(false); }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center" sx={{ my: 2 }}>{messages.setPassword.title}</Typography>
        <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{messages.setPassword.firstDescription}</Typography>
        <Typography textAlign="center" sx={{ mb: 3, mx: 2 }}>{messages.setPassword.secondDescription}</Typography>
        <Center>
          <Box mt={1} mb={5}>
            <PasswordSet
              setPassword={setPassword}
              userRefresh={userRefresh}
              closeDialog={() => { setTimeout(() => { setPasswordSet(false); }, 2000); }}
            />
          </Box>
        </Center>
      </Dialog>
      )}
      {
        resolver
        && visibleRecaptcha
        && mfaPhonePreSignIn
        && mfaPhonePostSignIn
        && mfaTotpSignIn
        && (
        <Dialog
          open={!!resolver}
          onClose={() => { setResolver(undefined); }}
          maxWidth="xs"
          fullWidth
        >
          <IconButton
            aria-label="close"
            onClick={() => { setResolver(undefined); }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <MFALogin
            resolver={resolver}
            visibleRecaptcha={visibleRecaptcha}
            mfaPhonePreSignIn={mfaPhonePreSignIn}
            mfaPhonePostSignIn={mfaPhonePostSignIn}
            mfaTotpSignIn={mfaTotpSignIn}
            onSuccess={() => { setResolver(undefined); }}
            onSuccessMessage={onSuccessMessage}
            hideLayout
          />
        </Dialog>
        )
}
    </>
  );
};

export default EmailSign;
