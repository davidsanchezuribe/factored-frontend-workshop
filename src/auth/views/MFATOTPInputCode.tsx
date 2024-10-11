import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Stack } from '@mui/material';
import { TotpSecret } from 'firebase/auth';
import Center from '../../materialui/Center';
import useLocalization from '../../localization/useLocalization';
import InputFieldFMUI from '../../materialui/InputFieldFMUI';
import FMUIButton from '../../materialui/FMUIButton';

type MFATOTPInputProps = {
  totpSecret?: TotpSecret | boolean,
  submitFunction: (
    totpCode: string,
    setSubmitting: (submitting: boolean) => void,
  ) => void
};

type FormValues = {
  totpCode: string
};

const MFATOTPInputCode = ({
  totpSecret,
  submitFunction,
}: MFATOTPInputProps) => {
  const { getMessages } = useLocalization();
  const { mfaTOTPInputCode: messages } = getMessages();
  const initialValues: FormValues = { totpCode: '' };
  if (!totpSecret) return null;
  return (
    <Center>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          totpCode: Yup.string().matches(/^\d+$/, messages.onlyNumbers)
            .min(6, messages.numChar).max(6, messages.numChar)
            .required(messages.numChar),
        })}
        onSubmit={({ totpCode }, { setSubmitting }) => {
          submitFunction(totpCode, setSubmitting);
        }}
      >
        <Form>
          <Stack direction="row" alignItems="top" spacing={1}>
            <InputFieldFMUI name="totpCode" label={messages.label} height={56} integer inputProps={{ maxLength: 6 }} />
            <FMUIButton variant="contained" sx={{ height: 56 }}>{messages.codeConfirm}</FMUIButton>
          </Stack>
        </Form>
      </Formik>
    </Center>
  );
};

MFATOTPInputCode.defaultProps = {
  totpSecret: undefined,
};

export default MFATOTPInputCode;
