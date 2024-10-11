import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormButtons from '../../materialui/FormButtons';
import FormField from '../../materialui/FormField';
import FormLayout from '../../materialui/FormLayout';
import Modal from '../../materialui/Modal';
import useFeedback from '../../materialui/useFeedback';
import InputTextFMUI from '../../materialui/InputFieldFMUI';
import useLocalization from '../../localization/useLocalization';
import { ResetPassword } from '../AuthManagerTypes';
import useTrace from '../../useTrace';
import { getRootPath } from '../../utilities';

type PasswordResetProps = {
  resetPassword: ResetPassword,
  hideSignUp?: boolean,
  loginPath: string,
  signUpPath: string,
  displaySocialNetworksMessage?: boolean,
};

type FormValues = {
  email: string,
};

const PasswordReset = ({
  resetPassword,
  hideSignUp,
  loginPath,
  signUpPath,
  displaySocialNetworksMessage,
}: PasswordResetProps) => {
  const { getLanguage, getMessages } = useLocalization();
  const languageCode = getLanguage();
  const { passwordReset: messages } = getMessages();
  const { Link } = useTrace();
  const { navigate, redirectPath } = useTrace();
  const { fnHardHandler } = useFeedback();
  const [openSentMailDialog, setOpenSentMailDialog] = useState(false);
  const [openUserNotFoundDialog, setUserNotFoundDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { state } = useLocation();
  const [initialEmail, setInitialEmail] = useState<string>(state && state.email ? state.email : '');
  const initialValues: FormValues = {
    email: initialEmail,
  };
  return (
    <FormLayout title={messages.form.title}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object({
          email: Yup.string().email(messages.email.valid).required(messages.email.required),
        })}
        onReset={() => { setInitialEmail(''); }}
        onSubmit={({ email }, { setSubmitting }) => {
          const redirectURL = `${getRootPath()}${loginPath}?previousPath=${redirectPath}`;
          fnHardHandler(
            resetPassword(email, redirectURL, languageCode),
            {
              resolveError: { 'auth/user-not-found': () => { setUserNotFoundDialog(true); } },
              errorMessages: messages.errors,
              onSuccess: () => {
                setDialogMessage(`${messages.sentMailDialog.description} ${email}`);
                setOpenSentMailDialog(true);
              },
              setSubmitting,
            },
          );
        }}
      >
        {({ values: { email } }) => (
          <>
            <Modal
              open={openSentMailDialog}
              setOpen={setOpenSentMailDialog}
              description={dialogMessage}
              positiveLabel={messages.sentMailDialog.okLabel}
              positiveAction={() => { navigate(loginPath, { state: { email } }); }}
              negativeLabel={messages.sentMailDialog.cancelLabel}
            />
            <Modal
              open={openUserNotFoundDialog}
              setOpen={setUserNotFoundDialog}
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
              <FormButtons
                resetLabel={messages.form.clean}
                continueLabel={messages.form.reset}
              />
              <FormField mt={2}>
                <Link to={loginPath} underline="none" align="center">
                  {`${messages.form.backToLogin} ${displaySocialNetworksMessage ? messages.form.socialNetworks : ''} ${messages.form.clickHere}`}
                </Link>
              </FormField>
              { !hideSignUp && (
                <FormField mt={1}>
                  <Link to={signUpPath} underline="none">{messages.form.notRegistered}</Link>
                </FormField>
              )}
            </Form>
          </>
        )}
      </Formik>
    </FormLayout>
  );
};

export default PasswordReset;
