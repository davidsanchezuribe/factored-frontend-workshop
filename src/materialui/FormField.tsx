import React, { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

type FormFieldProps = {
  mt?: number,
  mr?: number,
  mb?: number,
  ml?: number,
  justifyContent?: 'center' | 'right' | 'left' | 'space-between',
};

const FormField = ({
  mt = 0,
  mr = 0,
  mb = 0,
  ml = 0,
  justifyContent = 'center',
  children,
} : FormFieldProps & PropsWithChildren) => (
  <Box
    display="flex"
    justifyContent={justifyContent}
    mt={mt}
    mr={mr}
    mb={mb}
    ml={ml}
  >
    {children}
  </Box>
);

FormField.defaultProps = {
  mt: undefined,
  mr: undefined,
  mb: undefined,
  ml: undefined,
  justifyContent: undefined,
};

export default FormField;
