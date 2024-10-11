import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MultiFactorResolver } from 'firebase/auth';
import { Divider } from '@mui/material';
import FormField from '../../materialui/FormField';
import FormLayout from '../../materialui/FormLayout';
import Modal from '../../materialui/Modal';
import useFeedback from '../../materialui/useFeedback';
import CheckboxFMUI from '../../materialui/CheckboxFMUI';
import InputTextFMUI from '../../materialui/InputFieldFMUI';
import useLocalization from '../../localization/useLocalization';
import {
  AuthSignIn,
  SendSignLink,
  VisibleRecaptcha,
  MFAPhonePreSignIn,
  MFAPhonePostSignIn,
  MFATOTPSignIn,
} from '../AuthManagerTypes';
import { useSetting } from '../../settings/withSettings';
import isLocalStorageAvailable from './isLocalStorageAvailable';
import useTrace from '../../useTrace';
import FormButtons from '../../materialui/FormButtons';
import MFALogin from './MFALogin';
import SocialProviders from './SocialProviders';
import useCountdown from '../../materialui/useCountdown';
import { getRootPath } from '../../utilities';

type LoginProps = {
  authSignIn?: AuthSignIn,
  sendSignLink?: SendSignLink,
  providers: (string | undefined)[],
  hideSignUp?: boolean,
  hidePasswordReset?: boolean,
  passwordResetPath: string,
  signUpPath: string,
  visibleRecaptcha?: VisibleRecaptcha,
  mfaPhonePreSignIn?: MFAPhonePreSignIn,
  mfaPhonePostSignIn?: MFAPhonePostSignIn,
  mfaTotpSignIn?: MFATOTPSignIn,
};

type FormValues = {
  email: string,
  password: string,
  emailLink: boolean,
  remember: boolean,
};

const Login = ({
  authSignIn,
  sendSignLink,
  providers,
  hideSignUp,
  hidePasswordReset,
  passwordResetPath,
  signUpPath,
  visibleRecaptcha,
  mfaPhonePreSignIn,
  mfaPhonePostSignIn,
  mfaTotpSignIn,
}: LoginProps) => {
  const { getLanguage, getMessages } = useLocalization();
  const languageCode = getLanguage();
  const { login: messages } = getMessages();
  const { Link, navigate, redirectPath } = useTrace();
  const { fnHardHandler } = useFeedback();
  const [resolver, setResolver] = useState<MultiFactorResolver | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(false);
  const googleProvider = providers.includes('google.com');
  const facebookProvider = providers.includes('facebook.com');
  const twitterProvider = providers.includes('twitter.com');
  const { state } = useLocation();
  const [initialEmail, setInitialEmail] = useState<string>(state && state.email ? state.email : '');
  const {
    disable, disabled, timeLeft, progress,
  } = useCountdown(60, false);
  const { isPersistent, useBooleanSetting, useStringNullableSetting } = useSetting();
  const [rememberSetting, setRememberSetting] = useBooleanSetting('remember');
  const [, setEmailForSignIn] = useStringNullableSetting('emailForSignIn');
  const initialValues: FormValues = {
    email: initialEmail,
    password: '',
    emailLink: !authSignIn,
    remember: rememberSetting || false,
  };
  if (resolver) {
    return (
      <MFALogin
        resolver={resolver}
        visibleRecaptcha={visibleRecaptcha}
        mfaPhonePreSignIn={mfaPhonePreSignIn}
        mfaPhonePostSignIn={mfaPhonePostSignIn}
        mfaTotpSignIn={mfaTotpSignIn}
      />
    );
  }
  if (checkingRedirect) return null;
  return (
    <FormLayout title={authSignIn || !sendSignLink ? messages.form.title : messages.form.altTitle}>
      { (authSignIn || sendSignLink) && (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object({
          email: Yup.string().email(messages.email.valid).required(messages.email.required),
          password: Yup.string().when('emailLink', {
            is: false,
            then: Yup.string().required(messages.password.required),
          }),
        })}
        onReset={() => { setInitialEmail(''); }}
        onSubmit={({
          email, password, emailLink, remember,
        }, { setSubmitting }) => {
          if (emailLink && sendSignLink) {
            console.log(`${getRootPath()}${redirectPath}?remember=${remember}`);
            fnHardHandler(
              sendSignLink(email, `${getRootPath()}${redirectPath}?remember=${remember}`, languageCode),
              {
                errorMessages: messages.errors,
                onSuccess: () => {
                  setRememberSetting(remember);
                  setEmailForSignIn(email);
                  disable();
                },
                onSuccessMessage: isLocalStorageAvailable() ? `${messages.sentMail} ${email}`
                  : `${messages.sentMail} ${email}. ${messages.errors['auth/web-storage-unsupported']}`,
                onSuccessSeverity: isLocalStorageAvailable() ? 'success' : 'warning',
                setSubmitting,
              },
            );
          } else if (authSignIn) {
            fnHardHandler(
              authSignIn(email, password, remember),
              {
                errorMessages: messages.errors,
                onSuccess: () => { setRememberSetting(remember); navigate(); },
                setSubmitting,
                resolveError: {
                  'auth/user-not-found': () => { setOpenDialog(true); },
                  'auth/multi-factor-auth-required': (authResolver) => { setResolver(authResolver as MultiFactorResolver); },
                },
              },
            );
          }
        }}
      >
        {({ values: { email, emailLink } }) => (
          <>
            <Modal
              open={openDialog}
              setOpen={setOpenDialog}
              title={messages.userNotFoundDialog.title}
              description={messages.userNotFoundDialog.description}
              positiveLabel={messages.userNotFoundDialog.positiveLabel}
              positiveAction={() => { navigate(signUpPath, { state: { email } }); }}
              negativeLabel={messages.userNotFoundDialog.negativeLabel}
            />
            <Form>
              <InputTextFMUI
                name="email"
                label={messages.email.label}
                required
              />
              {!emailLink && (
              <InputTextFMUI
                name="password"
                label={messages.password.label}
                type="password"
                required
              />
              )}
              <FormField justifyContent={authSignIn && sendSignLink ? 'space-between' : 'right'}>
                {authSignIn && sendSignLink && (
                <CheckboxFMUI
                  name="emailLink"
                  label={messages.emailLink.label}
                  tooltip={messages.emailLink.tooltip}
                />
                )}
                <CheckboxFMUI
                  name="remember"
                  label={messages.remember.label}
                  tooltip={isPersistent ? messages.remember.tooltip : `${messages.remember.tooltip}, ${messages.remember.noStorage}`}
                  disabled={!isPersistent}
                />
              </FormField>
              <FormButtons
                resetLabel={messages.form.reset}
                continueLabel={messages.form.login}
                continueTooltip={emailLink && disabled ? `${messages.sentLink} ${messages.tryAgain} ${timeLeft}` : undefined}
                disable={emailLink && disabled}
                progress={emailLink ? progress : undefined}
              />
              { !hidePasswordReset && (
              <FormField mt={3}>
                <Link to={passwordResetPath} underline="none">{messages.form.forgotPassword}</Link>
              </FormField>
              )}
              { authSignIn && !hideSignUp && (
              <FormField mt={1}>
                <Link to={signUpPath} underline="none">{messages.form.notRegistered}</Link>
              </FormField>
              )}
            </Form>
          </>
        )}
      </Formik>
      )}
      {(authSignIn || sendSignLink) && (googleProvider || facebookProvider || twitterProvider) && (
        <Divider variant="middle" sx={{ mt: 2 }}>{messages.form.or}</Divider>
      )}
      <SocialProviders
        authProviders={providers}
        onSuccess={() => { navigate(); }}
        setResolver={(res: unknown) => { setResolver(res as MultiFactorResolver); }}
        setCheckingRedirect={setCheckingRedirect}
      />
    </FormLayout>
  );
};

export default Login;
