/*
  Bug: For the vertical position to work, the property used is
  'height' which invisibly expands the component in the back.
  This makes actions like clickaway or the timeout of the autohide
  may not work correctly or disable buttons in de back if the user
  has the click on that area.
*/

import React, { useState } from 'react';
import {
  Alert as MuiAlert, Button, IconButton, Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransitionFactory from './TransitionFactory';
import { toastStyleDefaultProps } from './customStyles';

type InfoProps = {
  message: string,
  severity?: 'success' | 'warning' | 'info' | 'error',
  variant?: 'filled' | 'outlined' | 'standard',
  autoHideDuration?: number | null,
};

type ToastFunctionalProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  info: InfoProps,
};

export type ToastStyleProps = {
  vertical?: number | 'top' | 'bottom',
  horizontal?: 'center' | 'left' | 'right',
  slide?: 'left' | 'right' | 'up' | 'down' | boolean,
  persistOnClickAway?: boolean,
  button?: {
    title: string,
    callback: () => void,
    color?: 'success' | 'warning' | 'info' | 'error' | 'inherit' | 'primary' | 'secondary',
  },
};

type ToastProps = ToastFunctionalProps & ToastStyleProps;

const Toast = ({
  open,
  setOpen,
  info,
  vertical: verticalPosition = 'bottom',
  horizontal = 'center',
  slide,
  persistOnClickAway,
  button,
}: ToastProps) => {
  const vertical = typeof verticalPosition === 'number' ? 'bottom' : verticalPosition;
  const height = typeof verticalPosition === 'number' ? `${185 - Math.round((verticalPosition / 100) * 185)}%` : undefined;
  const alertElevation = 4;
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' && persistOnClickAway) return;
    setOpen(false);
  };
  const action = (
    <>
      { button && (
        <Button
          color={button.color || 'secondary'}
          size="small"
          onClick={(event) => {
            handleClose(event);
            button.callback();
          }}
        >
          { button.title }
        </Button>
      ) }
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  const { message } = info;
  const Transition = TransitionFactory({ slide });
  const { severity, autoHideDuration = 4000 } = info;
  if (severity) {
    const {
      variant = 'filled',
    } = info;
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        TransitionComponent={Transition}
        sx={{ height }}
      >
        <MuiAlert
          onClose={handleClose}
          severity={severity}
          elevation={alertElevation}
          variant={variant}
          action={action}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    );
  }
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={Transition}
      sx={{ height }}
    />
  );
};

Toast.defaultProps = {
  vertical: undefined,
  horizontal: undefined,
  slide: undefined,
  persistOnClickAway: undefined,
  button: undefined,
};

export type ToastFn = (
  message: string,
  severity?: 'success' | 'warning' | 'info' | 'error',
  variant?: 'filled' | 'outlined' | 'standard',
  autoHideDuration?: number | null,
) => void;

export type WithToastProps = {
  toast: ToastFn,
};

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<InfoProps>({ message: '' });
  const toast: ToastFn = (
    message: string,
    severity?: 'success' | 'warning' | 'info' | 'error',
    variant?: 'filled' | 'outlined' | 'standard',
    autoHideDuration?: number | null,
  ) => {
    setInfo({
      message,
      severity,
      variant,
      autoHideDuration,
    });
    setOpen(true);
  };
  return ({
    open, setOpen, info, toast,
  });
};

export const withToast = <P extends WithToastProps>(
  Component: React.ComponentType<P>,
  toastStyleProps: ToastStyleProps = toastStyleDefaultProps,
) => (props: Omit<P, keyof WithToastProps>) => {
    const {
      open, setOpen, info, toast,
    } = useToast();
    return (
      <>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props as P}
          toast={toast}
        />
        <Toast
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...toastStyleProps}
          open={open}
          setOpen={setOpen}
          info={info}
        />
      </>

    );
  };

export default Toast;
