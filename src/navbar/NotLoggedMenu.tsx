import React from 'react';
import Box from '@mui/material/Box';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { MenuButtonLink, MenuIconLink } from './Components';
import { getBreakpoint } from '../materialui/getBreakpoint';
import CustomMenu from '../materialui/CustomMenu';
import { DropdownLinkProps } from '../materialui/DropdownLinkProps';

type NotLoggedMenuProps = {
  accountTooltipName?: string,
  signIn: DropdownLinkProps,
  signUp?: DropdownLinkProps,
};

const NotLoggedMenu = ({
  accountTooltipName,
  signIn,
  signUp,
}: NotLoggedMenuProps) => {
  const breakpoint = getBreakpoint();
  const hide = !(breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md');
  if (hide) {
    return (
      <>
        {signUp && (
        <MenuButtonLink
          name={signUp.name}
          pathOrAction={signUp.pathOrAction}
        />
        )}
        <MenuButtonLink
          name={signIn.name}
          pathOrAction={signIn.pathOrAction}
        />
      </>
    );
  }
  if (signUp) {
    return (
      <CustomMenu
        links={[
          { name: signIn.name, pathOrAction: signIn.pathOrAction },
          { name: signUp.name, pathOrAction: signUp.pathOrAction },
        ]}
        tooltip={accountTooltipName || 'Account'}
        MenuIcon={AccountCircleOutlinedIcon}
      />
    );
  }
  return (
    <Box>
      <MenuIconLink
        name={accountTooltipName || 'Account'}
        pathOrAction={signIn.pathOrAction}
        Icon={LoginIcon}
      />
    </Box>
  );
};

export default NotLoggedMenu;
