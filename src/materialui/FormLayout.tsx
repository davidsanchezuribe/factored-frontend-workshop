import React, { PropsWithChildren } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { formStyle } from './customStyles';

type FormLayoutProps = {
  title: string,
  titleBottomMargin?: number,
  large?: boolean,
  disableElevation?: boolean,
};

const FormLayout = ({
  title,
  titleBottomMargin = 4,
  large,
  disableElevation,
  children,
}: PropsWithChildren<FormLayoutProps>) => (
  <Grid container justifyContent="center">
    <Grid item xs={12} sm={large ? 12 : 10} md={large ? 10 : 8} lg={large ? 8 : 6}>
      <Paper elevation={disableElevation ? 0 : 4} sx={formStyle}>
        <Typography mb={titleBottomMargin} variant="h5" align="center">
          {title}
        </Typography>
        {children}
      </Paper>
    </Grid>
  </Grid>
);

export default FormLayout;
