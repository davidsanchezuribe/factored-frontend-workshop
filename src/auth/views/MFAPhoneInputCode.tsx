import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Divider, Stack } from '@mui/material';
import Center from '../../materialui/Center';
import useLocalization from '../../localization/useLocalization';
import InputFieldFMUI from '../../materialui/InputFieldFMUI';
import FMUIButton from '../../materialui/FMUIButton';

type MFAPhoneInputProps = {
  verificationId?: string,
  submitFunction: (
    smsCode: string,
    setSubmitting: (submitting: boolean) => void,
  ) => void
};

type FormValues = {
  smsCode: string
};

const MFAPhoneInputCode = ({
  verificationId,
  submitFunction,
}: MFAPhoneInputProps) => {
  const { getMessages } = useLocalization();
  const { mfaPhoneInputCode: messages } = getMessages();
  const initialValues: FormValues = { smsCode: '' };
  if (!verificationId) return null;
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Center>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            smsCode: Yup.string().matches(/^\d+$/, messages.onlyNumbers)
              .min(6, messages.numChar).max(6, messages.numChar)
              .required(messages.numChar),
          })}
          onSubmit={({ smsCode }, { setSubmitting }) => {
            if (!verificationId) return;
            submitFunction(smsCode, setSubmitting);
          }}
        >
          <Form>
            <Stack direction="row" alignItems="top" spacing={1}>
              <InputFieldFMUI name="smsCode" label={messages.label} height={56} integer inputProps={{ maxLength: 6 }} />
              <FMUIButton variant="contained" sx={{ height: 56 }}>{messages.codeConfirm}</FMUIButton>
            </Stack>
          </Form>
        </Formik>
      </Center>
    </>
  );
};

MFAPhoneInputCode.defaultProps = {
  verificationId: undefined,
};

export default MFAPhoneInputCode;
