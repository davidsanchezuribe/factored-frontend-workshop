import { useMediaQuery, useTheme } from '@mui/material';

export const getBreakpoint = () => {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const md = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const sm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  if (xl) return 'xl';
  if (lg) return 'lg';
  if (md) return 'md';
  if (sm) return 'sm';
  return 'xs';
};

export const getBreakpointValue = <T extends unknown>(array: [T, T, T, T, T]) => {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const md = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const sm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  if (xl) return array[4];
  if (lg) return array[3];
  if (md) return array[2];
  if (sm) return array[1];
  return array[0];
};
