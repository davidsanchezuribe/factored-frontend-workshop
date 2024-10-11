import React, { useState } from 'react';
import Modal from '../materialui/Modal';
import { getSettingsConsent, isLocalStorageAvailable, setSettingsConsent } from './settingsConsent';
import useLocalization from '../localization/useLocalization';

const withCookieConsent = (BaseApp: React.ComponentType) => () => {
  const { getMessages } = useLocalization();
  const { cookieConsent: messages } = getMessages();
  const status = getSettingsConsent();
  const [open, setOpen] = useState(typeof status === 'undefined');
  return (
    <>
      { isLocalStorageAvailable()
        ? (
          <Modal
            open={open}
            setOpen={setOpen}
            title={messages.title}
            description={messages.storage.message}
            positiveLabel={messages.storage.agree}
            positiveAction={() => { setSettingsConsent(true); }}
            negativeLabel={messages.storage.disagree}
            negativeAction={() => { setSettingsConsent(false); }}
          />
        )
        : (
          <Modal
            open={open}
            setOpen={setOpen}
            title={messages.title}
            description={messages.notStorage.message}
            positiveLabel={messages.notStorage.understand}
            removeNegative
          />
        )}
      <BaseApp />
    </>
  );
};

export default withCookieConsent;
