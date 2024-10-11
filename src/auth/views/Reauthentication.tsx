import React, { useState } from 'react';
import {
  Box, Dialog, Divider, IconButton, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { MultiFactorResolver } from 'firebase/auth';
import useLocalization from '../../localization/useLocalization';
import InputFieldFMUI from '../../materialui/InputFieldFMUI';
import Center from '../../materialui/Center';
import { getBreakpointValue } from '../../materialui/getBreakpoint';
import FormField from '../../materialui/FormField';
import CheckboxFMUI from '../../materialui/CheckboxFMUI';
import { useSetting } from '../../settings/withSettings';
import FormButtons from '../../materialui/FormButtons';
import isLocalStorageAvailable from './isLocalStorageAvailable';
import {
  emailReauthentication,
  mfaPhonePostSignIn,
  mfaPhonePreSignIn,
  mfaTotpSignIn,
  sendSignLink,
  visibleRecaptcha,
} from '../authManager';
import { AuthUser } from '../AuthManagerTypes';
import MFALogin from './MFALogin';
import SocialProviders from './SocialProviders';
import useFeedback from '../../materialui/useFeedback';
import useCountdown from '../../materialui/useCountdown';
import { getRootPath } from '../../utilities';

type ReauthenticationProps = {
  authUser: AuthUser,
  openModal: boolean,
  setOpenModal: (openModal: boolean) => void,
  successMessage?: string,
  emailHint: string,
  onSuccess?: () => void,
};

type FormValues = {
  userEmail: string,
  password: string,
  emailLink: boolean,
};

const Reauthentication = ({
  authUser,
  openModal,
  setOpenModal,
  successMessage,
  emailHint,
  onSuccess,
}: ReauthenticationProps) => {
  const closeModal = () => { setOpenModal(false); };
  const { email: userEmail, providers } = authUser;
  const email = userEmail || '';
  const { getMessages, getLanguage } = useLocalization();
  const languageCode = getLanguage();
  const { pathname: redirectPath } = useLocation();
  const { reauthentication: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  const {
    disable, disabled, timeLeft, progress,
  } = useCountdown(60, false);
  const [checkingRedirect, setCheckingRedirect] = useState(false);
  const googleProvider = providers.includes('google.com');
  const facebookProvider = providers.includes('facebook.com');
  const twitterProvider = providers.includes('twitter.com');
  const [resolver, setResolver] = useState<MultiFactorResolver | undefined>(undefined);
  const { useBooleanSetting, useStringNullableSetting } = useSetting();
  const [rememberSetting] = useBooleanSetting('remember');
  const [, setEmailForSignIn] = useStringNullableSetting('emailForSignIn');
  const width = getBreakpointValue(['95%', '70%', '60%', '60%', '60%']);
  const emailLinkProvider = providers.includes('emailLink');
  const passwordProvider = providers.includes('password');
  const initialValues: FormValues = {
    userEmail: email,
    password: '',
    emailLink: !passwordProvider,
  };
  if (checkingRedirect) return null;
  return (
    <Dialog
      open={openModal}
      onClose={setOpenModal}
      maxWidth="sm"
      fullWidth
    >
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      { resolver
        ? (
          <MFALogin
            resolver={resolver}
            visibleRecaptcha={visibleRecaptcha}
            mfaPhonePreSignIn={mfaPhonePreSignIn}
            mfaPhonePostSignIn={mfaPhonePostSignIn}
            mfaTotpSignIn={mfaTotpSignIn}
            hideLayout
            onSuccess={() => { closeModal(); if (onSuccess) onSuccess(); }}
            onSuccessMessage={successMessage}
          />
        )
        : (
          <>
            <Typography variant="h5" align="center" sx={{ my: 2 }}>{messages.title}</Typography>
            <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{messages.description}</Typography>
            { (emailLinkProvider || passwordProvider) && (
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={Yup.object({
                  password: Yup.string().when('emailLink', {
                    is: false,
                    then: Yup.string().required(messages.password.required),
                  }),
                })}
                onSubmit={({
                  emailLink,
                  password,
                }, { setSubmitting }) => {
                  if (emailLink && emailLinkProvider) {
                    fnHardHandler(
                      sendSignLink(email, `${getRootPath()}${redirectPath}?remember=${rememberSetting}&${emailHint}=true`, languageCode),
                      {
                        errorMessages: messages.errors,
                        onSuccess: () => {
                          setEmailForSignIn(email);
                          disable();
                        },
                        onSuccessMessage: isLocalStorageAvailable() ? `${messages.sentMail} ${email}`
                          : `${messages.sentMail} ${email}. ${messages.errors['auth/web-storage-unsupported']}`,
                        onSuccessSeverity: isLocalStorageAvailable() ? 'success' : 'warning',
                        setSubmitting,
                      },
                    );
                  } else if (passwordProvider) {
                    fnHardHandler(
                      emailReauthentication(email, password),
                      {
                        errorMessages: messages.errors,
                        onSuccess: () => { closeModal(); if (onSuccess) onSuccess(); },
                        setSubmitting,
                        resolveError: {
                          'auth/multi-factor-auth-required': (res) => { setResolver(res as MultiFactorResolver); },
                        },
                        onSuccessMessage: successMessage,
                        // hideLoading: true,
                      },
                    );
                  }
                }}
              >
                {({ values: { emailLink } }) => (
                  <Form>
                    <Center>
                      <Box width={width} mt={1} mb={3}>
                        <InputFieldFMUI
                          name="userEmail"
                          label={messages.email.label}
                          disabled
                        />
                        {!emailLink && (
                        <InputFieldFMUI
                          name="password"
                          label={messages.password.label}
                          type="password"
                          required
                        />
                        )}
                        <FormField justifyContent="right">
                          {passwordProvider && emailLinkProvider && (
                          <CheckboxFMUI
                            name="emailLink"
                            label={messages.emailLink.label}
                            tooltip={messages.emailLink.tooltip}
                          />
                          )}
                        </FormField>
                        <FormButtons
                          resetLabel={messages.form.reset}
                          hideReset={emailLink}
                          continueLabel={emailLink ? messages.form.sendLink : messages.form.confirm}
                          continueTooltip={emailLink && disabled ? `${messages.sentLink} ${messages.tryAgain} ${timeLeft}` : undefined}
                          disable={emailLink && disabled}
                          progress={emailLink ? progress : undefined}
                        />
                      </Box>
                    </Center>
                  </Form>
                )}
              </Formik>
            )}
            {(emailLinkProvider || passwordProvider)
              && (googleProvider || facebookProvider || twitterProvider)
              && (
                <Divider variant="middle" sx={{ mt: 2 }}>{messages.form.or}</Divider>
              )}
            <SocialProviders
              authProviders={providers}
              onSuccess={() => { closeModal(); if (onSuccess) onSuccess(); }}
              onSuccessMessage={successMessage}
              email={email}
              setResolver={(res: unknown) => { setResolver(res as MultiFactorResolver); }}
              setCheckingRedirect={setCheckingRedirect}
              mb={3}
            />
          </>
        )}
    </Dialog>
  );
};

export const useReauthentication = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [onSuccess, setOnSuccess] = React.useState<(() => void) | undefined>();
  const reauthenticate = (callback?: () => void) => {
    setOnSuccess(() => callback);
    return () => { setOpenModal(true); };
  };
  return {
    openModal, setOpenModal, onSuccess, reauthenticate,
  };
};

export default Reauthentication;
