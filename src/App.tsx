import React from 'react';
import { createRoot } from 'react-dom/client';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import RoutedApp from './RoutedApp';
import {
  withNavBar,
  withAuthManager,
  withSettings,
  withStyle,
  withLocalization,
  withCookieConsent,
  withRedux,
} from './appWrappers';

const AppWithNavBar = withNavBar(RoutedApp);
const AppWithAuthManager = withAuthManager(AppWithNavBar);
const AppWithSettings = withSettings(AppWithAuthManager);
const AppWithCookieConsent = withCookieConsent(AppWithSettings);
const AppWithStyle = withStyle(AppWithCookieConsent);
const AppWithLocalization = withLocalization(AppWithStyle);
const AppWithRedux = withRedux(AppWithLocalization);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement as Element);

root.render(
  <React.StrictMode>
    <AppWithRedux />
  </React.StrictMode>,
);
