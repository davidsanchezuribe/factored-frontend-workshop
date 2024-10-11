import React, { useState } from 'react';
import {
  Box, Button, Link, Tooltip,
} from '@mui/material';
import Center from '../../materialui/Center';
import authyImage from '../../images/authy.jpg';
import gaImage from '../../images/googleAuthenticator.jpg';
import maImage from '../../images/microsoftAuthenticator.jpg';
import { getBreakpointValue } from '../../materialui/getBreakpoint';
import { getMobileOperatingSystem } from '../../utilities';
import useLocalization from '../../localization/useLocalization';

const TOTPApps = () => {
  const authyAndroid = 'https://play.google.com/store/apps/details?id=com.authy.authy&pcampaignid=web_share';
  const maAndroid = 'https://play.google.com/store/apps/details?id=com.azure.authenticator&pcampaignid=web_share';
  const gaAndroid = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pcampaignid=web_share';
  const authyIOS = 'https://apps.apple.com/us/app/twilio-authy/id494168017';
  const maIOS = 'https://apps.apple.com/us/app/microsoft-authenticator/id983156458';
  const gaIOS = 'https://apps.apple.com/co/app/google-authenticator/id388497605';
  const target = '_blank';
  const { getMessages } = useLocalization();
  const { totpApps: messages } = getMessages();
  const height = getBreakpointValue([45, 55, 65, 75, 75]);
  const size: 'small' | 'medium' = getBreakpointValue(['small', 'small', 'small', 'medium', 'medium']);
  const operatingSystem = getMobileOperatingSystem();
  const [androidOrIos, setAndroidOrIos] = useState(operatingSystem === 'iOS');
  return (
    <Center>
      <Box alignContent="center">
        <Button
          size={size}
          variant={androidOrIos ? 'outlined' : 'contained'}
          onClick={() => { setAndroidOrIos(false); }}
          sx={{ textTransform: 'none', mr: 1 }}
        >
          Android
        </Button>
      </Box>
      <Tooltip title={messages.authy} arrow>
        <Link href={androidOrIos ? authyIOS : authyAndroid} target={target} rel="noopener">
          <img src={authyImage} alt="logo" height={height} />
        </Link>
      </Tooltip>
      <Tooltip title={messages.ga} arrow>
        <Link href={androidOrIos ? gaIOS : gaAndroid} target={target} rel="noopener">
          <img src={gaImage} alt="logo" height={height} />
        </Link>
      </Tooltip>
      <Tooltip title={messages.ma} arrow>
        <Link href={androidOrIos ? maIOS : maAndroid} target={target} rel="noopener">
          <img src={maImage} alt="logo" height={height} />
        </Link>
      </Tooltip>
      <Box alignContent="center">
        <Button
          size={size}
          variant={androidOrIos ? 'contained' : 'outlined'}
          onClick={() => { setAndroidOrIos(true); }}
          sx={{ textTransform: 'none', ml: 1 }}
        >
          iOS
        </Button>
      </Box>
    </Center>
  );
};

export default TOTPApps;
