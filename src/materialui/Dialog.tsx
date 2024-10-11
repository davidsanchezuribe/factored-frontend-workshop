import React from 'react';
import { Button, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import FormLayout from './FormLayout';
import Center from './Center';

type Action = { action: () => void, name: string };

type DialogProps = {
  title: string,
  Icon?: SvgIconComponent,
  iconColor?: 'inherit' | 'error' | 'disabled' | 'action' | 'primary' | 'secondary' | 'info' | 'success' | 'warning',
  description?: string,
  primaryAction?: Action,
  secondaryActions?: Action[],
};

const Dialog = ({
  title,
  Icon,
  iconColor = 'error',
  description,
  primaryAction,
  secondaryActions,
}: DialogProps) => (
  <FormLayout title={title} titleBottomMargin={2}>
    {Icon && <Center><Icon color={iconColor} fontSize="large" /></Center>}
    {description && <Center><Typography mt={2} mb={3} width="80%" align="center">{description}</Typography></Center>}
    <Center>
      {secondaryActions?.map(({ action, name }) => <Button key={name} variant="contained" color="inherit" onClick={action} sx={{ mr: 1, mb: 1 }}>{name}</Button>)}
      {primaryAction && <Button variant="contained" onClick={primaryAction.action} sx={{ mb: 1 }}>{primaryAction.name}</Button>}
    </Center>
  </FormLayout>
);

Dialog.defaultProps = {
  Icon: undefined,
  iconColor: undefined,
  description: undefined,
  primaryAction: undefined,
  secondaryActions: undefined,
};

export default Dialog;
