import React from 'react';
import { Typography, Switch } from '@mui/material';
import { FieldHookConfig, useField } from 'formik';

type SwitchMUIProps = {
  disableLabel?: string,
  enableLabel?: string,
  my?: number,
};

const SwitchMUI = (props: SwitchMUIProps & FieldHookConfig<boolean>) => {
  const { disableLabel, enableLabel, my = 0 } = props;
  const [field] = useField(props);
  const { name, onChange, value } = field;
  return (
    <>
      {disableLabel && <Typography variant="body2" alignContent="center" color={value ? undefined : 'error'}>{disableLabel}</Typography>}
      <Switch name={name} checked={value} onChange={onChange} sx={{ my }} />
      {enableLabel && <Typography variant="body2" alignContent="center" color={value ? 'primary' : undefined}>{enableLabel}</Typography>}
    </>
  );
};

export default SwitchMUI;
