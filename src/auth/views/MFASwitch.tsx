import React from 'react';
import { Switch, Typography } from '@mui/material';
import Center from '../../materialui/Center';
import useLocalization from '../../localization/useLocalization';

type MFASwitchProps = {
  phoneOrTOTP: boolean | undefined,
  setPhoneOrTOTP: (phoneOrTOTP: boolean) => void,
};

const MFASwitch = ({
  phoneOrTOTP,
  setPhoneOrTOTP,
}: MFASwitchProps) => {
  const { getMessages } = useLocalization();
  const { mfaSwitch: messages } = getMessages();
  return (
    <Center>
      <Typography variant="body2" alignContent="center" color={phoneOrTOTP ? undefined : 'primary'}>{messages.viaPhone}</Typography>
      <Switch
        checked={phoneOrTOTP}
        onChange={(event) => { setPhoneOrTOTP(event.target.checked); }}
        sx={{ my: 2 }}
      />
      <Typography variant="body2" alignContent="center" color={phoneOrTOTP ? 'primary' : undefined}>{messages.viaTOTP}</Typography>
    </Center>
  );
};

export default MFASwitch;
