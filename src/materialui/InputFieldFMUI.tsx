import React, { useState } from 'react';
import { FieldHookConfig, useField } from 'formik';
import {
  BaseTextFieldProps,
  Box,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type CustomProps = {
  successMessage?: string,
  showSuccess?: boolean,
  preventPaste?: boolean,
  width?: string | number,
  height?: string | number,
  integer?: boolean,
};

const InputFieldFMUI = (props: BaseTextFieldProps
& FieldHookConfig<string>
& CustomProps) => {
  const {
    type,
    label,
    required,
    disabled,
    inputProps,
    variant = 'outlined',
    successMessage,
    showSuccess = false,
    preventPaste = false,
    width,
    height,
    integer,
  } = props;
  const [field, meta, helper] = useField(props);
  const {
    name,
    onBlur,
    onChange,
    value,
  } = field;
  const { error, touched } = meta;
  const { setValue } = helper;
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const fieldId = `id${name}`;
  const shrink = touched ? value !== '' : true;
  const endAdornment = ((required && value === '') || (type === 'password')) && (
    <>
      {required && value === '' && <InputAdornment position="end">*</InputAdornment>}
      {type === 'password' && (
      <InputAdornment position="end">
        {type === 'password' && (
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        )}
      </InputAdornment>
      )}
    </>
  );
  const sx = { width, height };
  const preventPasteFn = preventPaste
    ? (e: any) => { e.preventDefault(); return false; } : undefined;
  const integerOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (/^\d+$/.test(event.target.value) || event.target.value === '') setValue(event.target.value);
  };
  return (
    <Box
      mb={2}
    >
      <FormControl fullWidth={width === undefined} variant="outlined">
        <InputLabel
          color={!error && showSuccess ? 'success' : undefined}
          error={!!error && touched}
          htmlFor={fieldId}
          shrink={shrink}
        >
          {label}
        </InputLabel>
        {variant === 'outlined' && (
          <OutlinedInput
            type={showPassword ? 'text' : type}
            id={fieldId}
            label={label}
            color={!error && showSuccess ? 'success' : undefined}
            error={!!error && touched}
            disabled={disabled}
            inputProps={inputProps}
            notched={shrink}
            onPaste={preventPasteFn}
            required
            endAdornment={endAdornment}
            name={name}
            onBlur={onBlur}
            onChange={integer ? integerOnChange : onChange}
            value={value}
            sx={sx}
          />
        )}
        {variant === 'standard' && (
          <Input
            type={showPassword ? 'text' : type}
            id={fieldId}
            color={!error && showSuccess ? 'success' : undefined}
            error={!!error && touched}
            disabled={disabled}
            inputProps={inputProps}
            onPaste={preventPasteFn}
            required
            endAdornment={endAdornment}
            name={name}
            onBlur={onBlur}
            onChange={integer ? integerOnChange : onChange}
            value={value}
            sx={sx}
          />
        )}
        {variant === 'filled' && (
          <FilledInput
            type={showPassword ? 'text' : type}
            id={fieldId}
            color={!error && showSuccess ? 'success' : undefined}
            error={!!error && touched}
            disabled={disabled}
            inputProps={inputProps}
            onPaste={preventPasteFn}
            required
            endAdornment={endAdornment}
            name={name}
            onBlur={onBlur}
            onChange={integer ? integerOnChange : onChange}
            value={value}
            sx={sx}
          />
        )}
        <FormHelperText error={!!error} id={fieldId} sx={{ color: theme.palette.success.dark }}>
          {!!error && touched ? error : ''}
          {!error && touched ? successMessage : ''}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default InputFieldFMUI;
