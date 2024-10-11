import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial',
  },
  palette: {
    primary: {
      main: '#434D57',
      light: '#6F7A85',
      dark: '#2C353F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ed6a5a',
      light: '#eda5a0',
      dark: '#e35941',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
  },
});

export default theme;
