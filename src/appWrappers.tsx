import React from 'react';
import withNavBar from './navbar/withNavBar';
import withAuthManager from './auth/withAuthManager';
import withSettings from './settings/withSettings';
import withCookieConsent from './settings/withCookieConsent';
import withStyle from './materialui/withStyle';
import { withLocalization } from './localization/withLocalization';

const dummyWrapper = (BaseApp: React.ComponentType) => () => (
  <BaseApp />
);

const withRedux = dummyWrapper;

export {
  withNavBar,
  withAuthManager,
  withSettings,
  withCookieConsent,
  withStyle,
  withLocalization,
  withRedux,
};
