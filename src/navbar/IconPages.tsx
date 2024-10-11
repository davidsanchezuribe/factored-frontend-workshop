import React from 'react';
import Box from '@mui/material/Box';
import CustomMenu, { CustomMenuProps } from '../materialui/CustomMenu';

type IconPagesProps = {
  icons: Array<CustomMenuProps>,
};

const IconPages = ({ icons }: IconPagesProps) => {
  if (icons.length < 1) return null;
  return (
    <Box sx={{ display: { xs: 'flex' }, flexGrow: 0 }}>
      {icons.map(({
        hideBreakpoints, MenuIcon, tooltip, pathOrAction, links, badgeContent, isAlert,
      }) => (
        <CustomMenu
          key={tooltip}
          hideBreakpoints={hideBreakpoints}
          MenuIcon={MenuIcon}
          tooltip={tooltip}
          pathOrAction={pathOrAction}
          links={links}
          badgeContent={badgeContent}
          isAlert={isAlert}
        />
      ))}
    </Box>
  );
};

export default IconPages;
