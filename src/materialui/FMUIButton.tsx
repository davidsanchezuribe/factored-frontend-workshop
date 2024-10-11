import React from 'react';
import { Button, ButtonProps, Tooltip } from '@mui/material';
import { useFormikContext } from 'formik';

const FMUIButton = (props: ButtonProps) => {
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
    <Tooltip title={errorMessage} placement="bottom" arrow>
      <span>
        <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          type="submit"
          disabled={!isValid || isSubmitting}
        />
      </span>
    </Tooltip>
  );
};

export default FMUIButton;
