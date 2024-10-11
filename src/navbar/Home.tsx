import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import useTrace from '../useTrace';

type HomeProps = {
  hasLogo: boolean,
  logoImageOrAppName: string,
  homePath?: string | undefined,
  xs: boolean,
};

const Home = ({
  hasLogo,
  logoImageOrAppName,
  homePath = '/',
  xs,
}: HomeProps) => {
  const { Link } = useTrace();
  const sx = xs ? { flexGrow: 1, display: { xs: 'flex', md: 'none' } }
    : { mr: 2, display: { xs: 'none', md: 'flex' } };
  if (hasLogo && homePath) {
    return (
      <Link sx={sx} to={homePath}>
        <img src={logoImageOrAppName} alt="logo" height={50} />
      </Link>
    );
  }
  if (hasLogo && !homePath) {
    return (
      <Box sx={sx}>
        <img src={logoImageOrAppName} alt="logo" height={50} />
      </Box>
    );
  }
  if (!hasLogo && homePath) {
    return (
      <Link
        variant="h6"
        noWrap
        to={homePath}
        sx={sx}
        color="inherit"
        underline="none"
      >
        {logoImageOrAppName}
      </Link>
    );
  }
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={sx}
    >
      {logoImageOrAppName}
    </Typography>
  );
};

Home.defaultProps = {
  homePath: undefined,
};

export default Home;
