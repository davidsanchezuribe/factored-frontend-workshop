import React from 'react';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { NestedMenuItem } from 'mui-nested-menu';
import { DropdownButtonProps, DropdownLinkProps, decodePathOrAction } from '../materialui/DropdownLinkProps';
import MenuIconBuilder from '../materialui/MenuIconBuilder';

type MenuDropButtonProps = DropdownButtonProps;

export const MenuDropButton = ({
  MenuIcon, name, isTooltip, pathOrAction,
}: MenuDropButtonProps) => {
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction);
  return (
    <Tooltip title={isTooltip && name}>
      <MenuItem
        onClick={callback}
        disabled={disable}
        color={decoreColor}
      >
        <MenuIconBuilder MenuIcon={MenuIcon} />
        {!isTooltip && name && <Typography sx={{ pl: 1 }}>{name}</Typography>}
      </MenuItem>
    </Tooltip>
  );
};

MenuDropButton.defaultProps = {
  name: undefined,
  isTooltip: undefined,
  action: undefined,
};

type MenuDropLinkProps = {
  parentMenuOpen: boolean,
} & DropdownLinkProps;

export const MenuDropLink = ({
  name,
  pathOrAction,
  nestedLinks,
  parentMenuOpen,
}: MenuDropLinkProps) => {
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction);
  if (nestedLinks && nestedLinks.length > 0) {
    return (
      <NestedMenuItem
        parentMenuOpen={parentMenuOpen}
        label={name}
        onClick={callback}
        sx={{
          color: decoreColor,
          '&.MuiButtonBase-root:hover': {
            bgcolor: callback ? undefined : 'transparent',
          },
        }}
      >
        {nestedLinks.map((page) => {
          if ('MenuIcon' in page) {
            return (
              <MenuDropButton
                key={page.name}
                pathOrAction={page.pathOrAction}
                name={page.name}
                MenuIcon={page.MenuIcon}
                isTooltip={page.isTooltip}
              />
            );
          }
          return (
            <MenuDropLink
              key={page.name}
              pathOrAction={page.pathOrAction}
              name={page.name}
              nestedLinks={page.nestedLinks}
              parentMenuOpen={parentMenuOpen}
            />
          );
        })}
      </NestedMenuItem>
    );
  }
  return (
    <MenuItem onClick={callback} disabled={disable}>
      <Typography
        textAlign="center"
        color={disable ? undefined : decoreColor}
      >
        {name}
      </Typography>
    </MenuItem>
  );
};

type MenuButtonLinkProps = DropdownLinkProps;

export const MenuButtonLink = ({
  name,
  pathOrAction,
}: MenuButtonLinkProps) => {
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction, 'light');
  return (
    <Button
      onClick={callback}
      disabled={disable}
      sx={{ my: 2, display: 'block', color: decoreColor || 'white' }}
      disableRipple
    >
      <Typography noWrap>
        {name}
      </Typography>
    </Button>
  );
};

type IconLinkProps = {
  Icon: typeof SvgIcon,
} & DropdownLinkProps;

export const MenuIconLink = ({
  name,
  pathOrAction,
  Icon,
}: IconLinkProps) => {
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction, 'light');
  return (
    <Tooltip title={name}>
      <IconButton
        color="inherit"
        onClick={callback}
        disabled={disable}
        sx={{ p: 0, color: decoreColor }}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

type BadgeIconLinkProps = {
  icon: typeof SvgIcon,
  badgeContent: number,
  isAlert?: boolean,
  hideOnXS?: boolean,
} & DropdownLinkProps;

export const MenuBadgeIconLink = ({
  name,
  pathOrAction,
  icon: DisplayIcon,
  badgeContent,
  isAlert,
  hideOnXS = false,
}: BadgeIconLinkProps) => {
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction, 'light');
  return (
    <Tooltip title={name}>
      <IconButton
        size="large"
        aria-label={`show ${badgeContent} notifications of ${DisplayIcon.name}`}
        color="inherit"
        sx={{ color: decoreColor, display: hideOnXS ? { xs: 'none', md: 'flex' } : undefined }}
        onClick={callback}
        disabled={disable}
      >
        <Badge badgeContent={badgeContent} color={isAlert ? 'error' : 'warning'}>
          <DisplayIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

MenuBadgeIconLink.defaultProps = {
  isAlert: undefined,
  hideOnXS: undefined,
};
