import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import InputTextFMUI from '../../../materialui/InputFieldFMUI';
import useLocalization from '../../../localization/useLocalization';
import FormButtons from '../../../materialui/FormButtons';
import { AuthUser, SetPassword } from '../../AuthManagerTypes';
import StrengthBar from '../StrengthBar';
import useFeedback from '../../../materialui/useFeedback';
import Reauthentication, { useReauthentication } from '../Reauthentication';

type PasswordSetProps = {
  authUser?: AuthUser,
  setPassword: SetPassword,
  userRefresh: () => void,
  closeDialog?: () => void,
};

type FormValues = {
  password: string,
  confirmPassword: string,
};

const PasswordSet = ({
  authUser,
  setPassword,
  userRefresh,
  closeDialog,
}: PasswordSetProps) => {
  const { getMessages } = useLocalization();
  const { setPassword: messages } = getMessages();
  const { fnHardHandler } = useFeedback();
  const {
    openModal, setOpenModal, onSuccess, reauthenticate,
  } = useReauthentication();
  const initialValues: FormValues = {
    password: '',
    confirmPassword: '',
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          password: Yup.string().min(8, messages.password.min).max(64, messages.password.max)
            .required(messages.password.required),
          confirmPassword: Yup.string().required(messages.confirmPassword.required).oneOf([Yup.ref('password')], messages.confirmPassword.matchError),
        })}
        onSubmit={({ password }, { setSubmitting }) => {
          const onSuccessCallback = () => {
            fnHardHandler(
              setPassword(password),
              {
                errorMessages: messages.errors,
                resolveError: {
                  'auth/requires-recent-login': reauthenticate(onSuccessCallback),
                  'auth/user-token-expired': reauthenticate(onSuccessCallback),
                },
                onSuccessMessage: messages.form.successSet,
                keepSubmittingOnSuccess: true,
                setSubmitting,
                onSuccess: () => {
                  userRefresh();
                  if (closeDialog) closeDialog();
                },
              },
            );
          };
          onSuccessCallback();
        }}
      >
        {({ values: { password } }) => (
          <Form>
            <InputTextFMUI
              name="password"
              label={messages.password.label}
              type="password"
              required
              inputProps={{ maxLength: 64 }}
            />
            <StrengthBar password={password} />
            <InputTextFMUI
              name="confirmPassword"
              label={messages.confirmPassword.label}
              type="password"
              required
              preventPaste
            />
            <FormButtons
              resetLabel={messages.form.reset}
              continueLabel={messages.form.setPassword}
            />
          </Form>
        )}
      </Formik>
      {authUser && (
      <Reauthentication
        authUser={authUser}
        openModal={openModal}
        setOpenModal={setOpenModal}
        emailHint="setpassword"
        onSuccess={onSuccess}
      />
      )}
    </>
  );
};

PasswordSet.defaultProps = {
  authUser: undefined,
  closeDialog: undefined,
};

export default PasswordSet;
