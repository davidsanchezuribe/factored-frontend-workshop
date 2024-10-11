import React from 'react';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import { MenuButtonLink, MenuIconLink } from './Components';
import CustomMenu from '../materialui/CustomMenu';
import { DropdownLinkProps } from '../materialui/DropdownLinkProps';

type LoggedMenuProps = {
  accountTooltipName?: string,
  userName?: string,
  userImage?: string,
  userPages: Array<DropdownLinkProps>,
  logout: DropdownLinkProps,
  greetingMessage?: string,
  showLogoutButton: boolean,
};

const LoggedMenu = ({
  accountTooltipName,
  userName,
  userImage,
  userPages,
  logout,
  greetingMessage,
  showLogoutButton,
}: LoggedMenuProps) => {
  const accountMenu = userImage || userPages.length > 0;
  const accountLogout = (userPages.length > 0 && !showLogoutButton)
    || (userImage && userPages.length === 0);
  return (
    <>
      {greetingMessage && userName && (
        <Box sx={{ flexGrow: 0, display: { xs: 'none', lg: 'flex' }, mx: 1 }}>
          <Typography>{`${greetingMessage} ${userName}`}</Typography>
        </Box>
      )}
      {accountMenu && (
        <CustomMenu
          tooltip={accountTooltipName || (userName && `${userName} Account`) || 'Account'}
          MenuIcon={{
            name: userName || accountTooltipName || 'Account',
            src: userImage || userName,
            avatar: true,
          }}
          links={accountLogout
            ? [...userPages, { name: logout.name, pathOrAction: logout.pathOrAction }] : userPages}
        />
      )}
      {!accountLogout && (
        <>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', lg: 'flex' } }}>
            <MenuButtonLink
              name={logout.name}
              pathOrAction={logout.pathOrAction}
            />
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', lg: 'none' } }}>
            <MenuIconLink
              name={logout.name}
              pathOrAction={logout.pathOrAction}
              Icon={LogoutIcon}
            />
          </Box>
        </>
      )}
    </>
  );
};

LoggedMenu.defaultProps = {
  accountTooltipName: undefined,
  userName: undefined,
  userImage: undefined,
  greetingMessage: undefined,
};
export default LoggedMenu;
