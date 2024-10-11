import React from 'react';
import { Button, LinearProgress, Tooltip } from '@mui/material';
import { useFormikContext } from 'formik';
import FormField from './FormField';

export type FormButtonsProps = {
  resetLabel?: string,
  hideReset?: boolean,
  continueLabel?: string,
  continueTooltip?: string,
  secondaryLabel?: string,
  secondaryAction?: () => void,
  disable?: boolean,
  mt?: number,
  mb?: number,
  captchaRef?: ((node: HTMLButtonElement | null) => void) | undefined,
  progress?: number,
};

const FormButtons = ({
  resetLabel = 'reset',
  hideReset,
  continueLabel = 'continue',
  continueTooltip,
  secondaryLabel,
  secondaryAction,
  disable = false,
  mt = 0,
  mb = 0,
  captchaRef,
  progress,
}: FormButtonsProps) => {
  const { isValid, isSubmitting, errors } = useFormikContext();
  const errorMessages = Object.values(errors) as (string | undefined)[];
  const errorMessage = errorMessages.length > 0
    ? (
      <div>
        {errorMessages.map((error, index) => {
          if (!error) return undefined;
          if (index === 0) return error;
          return (
            <span key={error}>
              <br />
              {error}
            </span>
          );
        })}
      </div>
    ) : undefined;
  return (
    <FormField mt={mt} mb={mb}>
      {!hideReset && (
      <Button
        type="reset"
        variant="contained"
        color="inherit"
        sx={{ mr: 2 }}
        disabled
      >
        {resetLabel}
      </Button>
      )}
      { secondaryLabel && (
        <Button
          onClick={secondaryAction}
          variant="contained"
          color="inherit"
          sx={{ mr: 2 }}
        >
          {secondaryLabel}
        </Button>
      )}
      <Tooltip title={continueTooltip || errorMessage} placement="bottom" arrow>
        <span>
          <Button
            ref={captchaRef}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !isValid || disable}
            sx={{ height: progress && progress < 100 ? '95%' : '100%' }}
          >
            {continueLabel}
          </Button>
          {progress && progress < 100 && <LinearProgress color="primary" variant="determinate" value={progress} sx={{ height: '5%' }} />}
        </span>
      </Tooltip>
    </FormField>
  );
};

FormButtons.defaultProps = {
  resetLabel: undefined,
  hideReset: undefined,
  continueLabel: undefined,
  continueTooltip: undefined,
  secondaryLabel: undefined,
  secondaryAction: undefined,
  disable: undefined,
  mt: undefined,
  mb: undefined,
  captchaRef: undefined,
  progress: undefined,
};

export default FormButtons;
