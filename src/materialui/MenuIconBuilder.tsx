import React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import MuiMenuIcon from '@mui/icons-material/Menu';
import { Avatar, Icon, Typography } from '@mui/material';

export type MenuIconType = SvgIconComponent
| { name?: string, src: string, avatar?: false }
| { name?: string, src?: string, avatar: true }
| string;

type MenuIconBuilderProps = {
  MenuIcon?: MenuIconType,
};

const MenuIconBuilder = ({ MenuIcon }: MenuIconBuilderProps) => {
  if (typeof MenuIcon === 'string') {
    return (
      <Typography noWrap>
        {MenuIcon}
      </Typography>
    );
  }
  if (!MenuIcon) return <MuiMenuIcon />;
  if ('avatar' in MenuIcon || 'src' in MenuIcon) {
    const { src, name, avatar } = MenuIcon;
    if (avatar) return <Avatar alt={name} src={src} />;
    return <Icon fontSize="large" sx={{ lineHeight: 1 }}><img alt={name} src={src} /></Icon>;
  }
  return <MenuIcon />;
};

export default MenuIconBuilder;
