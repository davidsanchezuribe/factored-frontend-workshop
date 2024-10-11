import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Button, TextField, Typography } from '@mui/material';
import useLocalization from '../../../localization/useLocalization';
import Center from '../../../materialui/Center';
import SwitchMUI from '../../../materialui/SwitchMUI';
import { getSettingsConsent, setSettingsConsent } from '../../../settings/settingsConsent';
import { useSetting } from '../../../settings/withSettings';
import FormButtons from '../../../materialui/FormButtons';
import useFeedback from '../../../materialui/useFeedback';

type FormValues = {
  cookieConsent: boolean
};

const CookiesStorage = () => {
  const { getMessages } = useLocalization();
  const { cookiesStorage: messages } = getMessages();
  const { toast } = useFeedback();
  const [actualCookieConsent, setActualCookieConsent] = useState(getSettingsConsent() || false);
  const { getRawCookies, eraseCookies } = useSetting();
  const rawCookies = getRawCookies();
  const [showCookies, setShowCookies] = useState(false);
  const initialValues: FormValues = {
    cookieConsent: actualCookieConsent,
  };
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={({ cookieConsent }) => {
        setSettingsConsent(cookieConsent);
        setActualCookieConsent(cookieConsent);
        toast(cookieConsent ? messages.cookiesEnabled : messages.cookiesDisabled, 'success');
      }}
    >
      {({ values: { cookieConsent }, dirty }) => (
        <Form>
          <Center>
            <SwitchMUI
              name="cookieConsent"
              disableLabel={messages.disable}
              enableLabel={messages.enable}
              my={1}
            />
          </Center>
          {showCookies && (
            <TextField
              multiline
              value={rawCookies}
              fullWidth
              disabled
              sx={{ mb: 1, '& .MuiInputBase-input.Mui-disabled': { fontSize: 12, WebkitTextFillColor: '#000000' } }}
            />
          ) }
          <Center>
            { rawCookies === '' || rawCookies === '{}'
              ? <Typography textTransform="uppercase" color="primary" variant="button" mb={1}>{messages.noCookiesStoraged}</Typography>
              : (
                <>
                  <Button onClick={eraseCookies}>{messages.eraseCookies}</Button>
                  <Button onClick={() => { setShowCookies(!showCookies); }}>
                    {showCookies ? messages.hideCookies
                      : messages.showCookies}
                  </Button>
                </>
              )}
          </Center>
          {!cookieConsent && <Typography textAlign="center" sx={{ mb: 2, mx: 2 }}>{messages.description}</Typography>}
          <FormButtons
            resetLabel={messages.reset}
            continueLabel={messages.update}
            disable={!dirty}
            continueTooltip={dirty ? undefined : messages.noChangesTooltip}
            mt={1}
          />
        </Form>
      )}

    </Formik>
  );
};

export default CookiesStorage;
