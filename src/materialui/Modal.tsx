import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import TransitionFactory from './TransitionFactory';
import Center from './Center';

type ModalProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  title?: string,
  centerTitle?: boolean,
  description?: string,
  centerDescription?: boolean,
  children?: JSX.Element,
  removePositive?: boolean,
  positiveLabel?: string,
  // if is formik's child add validateOnMount to formik parent and
  // initialTouched={{ field1: true, field2: true }} if setTouched
  // is not passed construct setTouched in formik with
  // setTouched: () => { setTouched({ field1: true, field2: true }); }
  positiveAction?: (() => void) | {
    isValid: boolean,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
    setTouched?: () => void,
  },
  removeNegative?: boolean,
  negativeLabel?: string,
  negativeAction?: () => void,
  aditionalActions?: { label: string, action: () => void, keepOnClick?: boolean }[],
  preventClose?: boolean,
  slide?: 'left' | 'right' | 'up' | 'down' | boolean,
};

const Modal = ({
  open,
  setOpen,
  title,
  centerTitle,
  description,
  centerDescription,
  children,
  removePositive = false,
  positiveLabel = 'Ok',
  positiveAction,
  removeNegative = false,
  negativeLabel = 'Cancel',
  negativeAction,
  aditionalActions,
  preventClose,
  slide,
}: ModalProps) => {
  const handleClose = (_: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && preventClose) return;
    setOpen(false);
  };
  const performAction = (
    action?: (() => void)
    | {
      isValid: boolean,
      handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
      setTouched?: () => void,
    },
  ) => () => {
    if (action) {
      if ('isValid' in action) {
        const { isValid, handleSubmit, setTouched } = action;
        if (isValid) {
          handleSubmit();
          setOpen(false);
        } else if (setTouched) {
          setTouched();
        }
      } else {
        action();
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };
  const Transition = TransitionFactory({ slide, forwardRef: true });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
    >
      {title && <Center center={centerTitle}><DialogTitle id="alert-dialog-title">{title}</DialogTitle></Center>}
      {(description || children) && (
        <DialogContent>
          {description && <Center center={centerDescription}><DialogContentText id="alert-dialog-description">{description}</DialogContentText></Center>}
          {children && <Center>{children}</Center>}
        </DialogContent>
      )}
      <DialogActions>
        {!removeNegative && (
          <Button color="error" onClick={performAction(negativeAction)}>{negativeLabel}</Button>
        )}
        {aditionalActions && aditionalActions.map(({ label, action, keepOnClick }) => (
          <Button onClick={() => { action(); if (!keepOnClick) setOpen(false); }}>{label}</Button>
        ))}
        {!removePositive && (
          <Button onClick={performAction(positiveAction)} autoFocus>{positiveLabel}</Button>)}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
