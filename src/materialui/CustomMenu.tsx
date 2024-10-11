import React, { useEffect } from 'react';
import {
  Badge,
  Box, IconButton, Menu as MuiMenu, Tooltip,
} from '@mui/material';
import MuiMenuIcon from '@mui/icons-material/Menu';
import { getBreakpoint } from './getBreakpoint';
import { MenuDropButton, MenuDropLink } from '../navbar/Components';
import {
  DropdownButtonProps, DropdownLinkProps, PathOrAction, decodePathOrAction,
} from './DropdownLinkProps';
import MenuIconBuilder, { MenuIconType } from './MenuIconBuilder';

export type CustomMenuProps = {
  hideBreakpoints?: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[],
  MenuIcon?: MenuIconType | 'string',
  tooltip?: string,
  direction?: 'left' | 'right',
  pathOrAction?: PathOrAction,
  links?: DropdownLinkProps[] | DropdownButtonProps[],
  flexGrow?: number,
  badgeContent?: number,
  isAlert?: boolean,
};

const Menu = (props: CustomMenuProps) => {
  const {
    hideBreakpoints,
    MenuIcon = MuiMenuIcon,
    tooltip,
    direction = 'left',
    pathOrAction,
    links,
    flexGrow,
    badgeContent,
    isAlert,
  } = props;
  const { callback, decoreColor, disable } = decodePathOrAction(pathOrAction);

  const breakpoint = getBreakpoint();
  const hide = hideBreakpoints?.includes(breakpoint);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => { setAnchorEl(null); };
  useEffect(() => { if (hide && open) handleCloseMenu(); }, [hide]);
  if (hide) return null;
  const badgeColor = (() => {
    if (isAlert === undefined) return undefined;
    if (isAlert) return 'error';
    return 'warning';
  })();
  return (
    <Box
      onMouseEnter={callback ? handleOpenMenu : undefined}
      onMouseLeave={callback ? handleCloseMenu : undefined}
      sx={{ flexGrow }}
    >
      <Tooltip title={tooltip} placement={links && callback ? 'left' : undefined}>
        <span>
          <IconButton
            onClick={callback || (links && handleOpenMenu)}
            color={!decoreColor ? 'inherit' : undefined}
            disabled={disable}
            disableRipple={typeof MenuIcon === 'string'}
            sx={{ color: decoreColor, zIndex: callback ? 1 : undefined }}
          >
            <Badge badgeContent={badgeContent} color={badgeColor}>
              <MenuIconBuilder MenuIcon={MenuIcon} />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      { links && links.length > 0 && (
      <MuiMenu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction }}
        transformOrigin={{ vertical: 'top', horizontal: direction }}
        keepMounted
        sx={callback ? { zIndex: 0 } : undefined}
        onClose={handleCloseMenu}
      >
        <Box
          onClick={handleCloseMenu}
          onMouseLeave={callback ? handleCloseMenu : undefined}
        >
          {links.map((link) => {
            if ('MenuIcon' in link) {
              return (
                <MenuDropButton
                  key={link.name}
                  pathOrAction={link.pathOrAction}
                  name={link.name}
                  MenuIcon={link.MenuIcon}
                  isTooltip={link.isTooltip}
                />
              );
            }
            return (
              <MenuDropLink
                key={link.name}
                pathOrAction={link.pathOrAction}
                name={link.name}
                nestedLinks={link.nestedLinks}
                parentMenuOpen={open}
              />
            );
          })}
        </Box>
      </MuiMenu>
      )}

    </Box>
  );
};

export default Menu;
