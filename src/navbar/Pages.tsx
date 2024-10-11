import React from 'react';
import { Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomMenu from '../materialui/CustomMenu';
import { DropdownLinkProps } from '../materialui/DropdownLinkProps';

type HamburgerPagesProps = {
  pages: Array<DropdownLinkProps>,
};

export const HamburgerPages = ({ pages }: HamburgerPagesProps) => pages.length > 0 && (
<CustomMenu
  hideBreakpoints={['md', 'lg', 'xl']}
  links={pages}
  flexGrow={2}
/>
);

type NormalPagesProps = {
  pages: Array<DropdownLinkProps>,
};

const dividePages = (pages: Array<DropdownLinkProps>) => {
  let maxWidth = 50;
  const buttonPages: DropdownLinkProps[] = [];
  const dropDownMenuPages: DropdownLinkProps[] = [];
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    if (maxWidth > 0) {
      buttonPages.push(page);
    } else {
      dropDownMenuPages.push(page);
    }
    const { name } = page;
    maxWidth = maxWidth - name.length - 2;
  }
  return [buttonPages, dropDownMenuPages];
};

export const NormalPages = ({ pages }: NormalPagesProps) => {
  const [buttonPages, dropDownMenuPages] = dividePages(pages);
  return (
    <Stack direction="row" sx={{ flexGrow: 1 }}>
      {buttonPages.map(({ name, pathOrAction, nestedLinks }) => (
        <CustomMenu
          key={name}
          hideBreakpoints={['xs', 'sm']}
          MenuIcon={name}
          pathOrAction={pathOrAction}
          links={nestedLinks}
        />
      ))}
      {dropDownMenuPages.length > 0 && (
      <CustomMenu
        hideBreakpoints={['xs', 'sm']}
        MenuIcon={MoreHorizIcon}
        links={dropDownMenuPages}
      />
      )}
    </Stack>
  );
};
