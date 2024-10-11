import React from 'react';
import { FieldHookConfig, useField } from 'formik';
import { Checkbox, FormControlLabel, Tooltip } from '@mui/material';

const CheckboxFMUI = (props: {
  tooltip?: string,
  label: string,
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom',
  color?: 'warning' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'default',
  mr?: number,
  mb?: number,
} & FieldHookConfig<boolean>) => {
  const {
    disabled, tooltip, label, labelPlacement, color, mr, mb = 2,
  } = props;
  const [field] = useField(props);
  const {
    name,
    onChange,
    value,
  } = field;
  return (
    <Tooltip title={tooltip} placement="right" arrow>
      <FormControlLabel
        control={(
          <Checkbox
            name={name}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            color={color}
          />
)}
        label={label}
        labelPlacement={labelPlacement}
        sx={{ mr, mb }}
      />
    </Tooltip>
  );
};

export default CheckboxFMUI;
