import React, { PropsWithChildren } from 'react';
import { Grid } from '@mui/material';

type CenterProps = {
  center?: boolean,
  mt?: number,
  mb?: number,
};

const Center = ({
  children,
  center = true,
  mt = 0,
  mb = 0,
}: PropsWithChildren<CenterProps>) => {
  if (center) return <Grid container justifyContent="center" mt={mt} mb={mb}>{children}</Grid>;
  return children;
};

export default Center;
