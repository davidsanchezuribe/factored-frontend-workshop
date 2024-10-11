import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../materialui/FormField';
import FormLayout from '../../materialui/FormLayout';
import Modal from '../../materialui/Modal';
import CheckboxFMUI from '../../materialui/CheckboxFMUI';
import InputTextFMUI from '../../materialui/InputFieldFMUI';
import useLocalization from '../../localization/useLocalization';
import { AuthSignUp } from '../AuthManagerTypes';
import { useSetting } from '../../settings/withSettings';
import StrengthBar from './StrengthBar';
import useTrace from '../../useTrace';
import FormButtons from '../../materialui/FormButtons';
import useFeedback from '../../materialui/useFeedback';

type SignUpProps = {
  authSignUp: AuthSignUp,
  loginPath: string,
  displaySocialNetworksMessage?: boolean,
};

type FormValues = {
  email: string,
  confirmEmail: string,
  password: string,
  remember: boolean,
};

const SignUp = ({
  authSignUp,
  loginPath,
  displaySocialNetworksMessage,
}: SignUpProps) => {
  const { signUp: messages } = useLocalization().getMessages();
  const { Link, navigate } = useTrace();
  const { fnHardHandler } = useFeedback();
  const [openExistentAccountDialog, setOpenExistentAccountDialog] = useState(false);
  const [openCookiesErrorDialog, setOpenCookiesErrorDialog] = useState(false);
  const { state } = useLocation();
  const [initialEmail, setInitialEmail] = useState<string>(state && state.email ? state.email : '');
  const { isPersistent, useBooleanSetting } = useSetting();
  const [rememberSetting, setRememberSetting] = useBooleanSetting('remember');
  const initialValues: FormValues = {
    email: initialEmail,
    confirmEmail: '',
    password: '',
    remember: rememberSetting || false,
  };
  return (
    <FormLayout title={messages.form.title}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object({
          email: Yup.string().email(messages.email.valid).required(messages.email.required),
          confirmEmail: Yup.string().email(messages.confirmEmail.valid)
            .required(messages.confirmEmail.required).oneOf([Yup.ref('email')], messages.confirmEmail.matchError),
          password: Yup.string().min(8, messages.password.min).max(64, messages.password.max)
            .required(messages.password.required),
        })}
        onReset={() => { setInitialEmail(''); }}
        onSubmit={({ email, password, remember }, { setSubmitting }) => {
          fnHardHandler(
            authSignUp(email, password, remember),
            {
              errorMessages: messages.errors,
              onSuccess: () => { setRememberSetting(remember); navigate(); },
              setSubmitting,
              resolveError: {
                'auth/web-storage-unsupported': () => { setOpenCookiesErrorDialog(true); },
                'auth/email-already-in-use': () => { setOpenExistentAccountDialog(true); },
              },
            },
          );
        }}
      >
        {({ values: { email, password } }) => (
          <>
            <Modal
              open={openExistentAccountDialog}
              setOpen={setOpenExistentAccountDialog}
              title={messages.existentAccountDialog.title}
              description={messages.existentAccountDialog.description}
              positiveLabel={messages.existentAccountDialog.positiveLabel}
              positiveAction={() => { navigate(loginPath, { state: { email } }); }}
              negativeLabel={messages.existentAccountDialog.negativeLabel}
            />
            <Modal
              open={openCookiesErrorDialog}
              setOpen={setOpenCookiesErrorDialog}
              title={messages.cookiesErrorDialog.title}
              description={messages.cookiesErrorDialog.description}
              positiveLabel={messages.cookiesErrorDialog.positiveLabel}
              positiveAction={() => { navigate(loginPath, { state: { email } }); }}
              removeNegative
            />
            <Form>
              <InputTextFMUI
                name="email"
                label={messages.email.label}
                required
              />
              <InputTextFMUI
                name="confirmEmail"
                label={messages.confirmEmail.label}
                required
                successMessage={messages.confirmEmail.matchSuccess}
                preventPaste
              />
              <InputTextFMUI
                name="password"
                label={messages.password.label}
                type="password"
                required
                inputProps={{ maxLength: 64 }}
              />
              <StrengthBar password={password} />
              <FormField justifyContent="right">
                <CheckboxFMUI
                  name="remember"
                  label={messages.remember.label}
                  tooltip={isPersistent ? messages.remember.tooltip : `${messages.remember.tooltip}, ${messages.remember.noStorage}`}
                  disabled={!isPersistent}
                />
              </FormField>
              <FormButtons
                resetLabel={messages.form.reset}
                continueLabel={messages.form.signUp}
              />
              <FormField mt={2}>
                <Link to={loginPath} underline="none" align="center">
                  {`${messages.form.alreadyRegistered} ${displaySocialNetworksMessage ? messages.form.socialNetworks : ''} ${messages.form.clickHere}`}
                </Link>
              </FormField>
            </Form>
          </>
        )}
      </Formik>
    </FormLayout>
  );
};

export default SignUp;
