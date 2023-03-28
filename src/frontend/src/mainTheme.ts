import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9a6350',
      light: '#C09E92CC',
      contrastText: '#f6ead5',
    },
    secondary: {
      main: '#8fb6b6',
    },
    success: { main: '#4ee4a9' },
    grey: {
      50: '#994a2e',
      100: '#994a2e',
      200: '#994a2e',
      300: '#994a2e',
      400: '#994a2e',
      500: '#994a2e',
      600: '#994a2e',
      700: '#994a2e',
      A100: '#994a2e',
      A200: '#994a2e',
      A400: '#994a2e',
      A700: '#994a2e',
    },
    text: {
      primary: '#25343f',
      secondary: '#994a2e',
      disabled: '#994a2e',
    },
    divider: '#a3b8b8',
    background: {
      paper: '#F8EFE0AA',
      default: '#f1a080',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#03151B',
      light: '#606566BB',
      contrastText: '#a3b8b8',
    },
    secondary: {
      main: '#8ed8e7',
    },
    success: { main: '#41c79e' },
    grey: {
      50: '#994a2e',
      100: '#994a2e',
      200: '#994a2e',
      300: '#994a2e',
      400: '#994a2e',
      500: '#994a2e',
      600: '#994a2e',
      700: '#994a2e',
      A100: '#994a2e',
      A200: '#994a2e',
      A400: '#994a2e',
      A700: '#994a2e',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,0.7)',
      disabled: 'rgba(255,255,255,0.5)',
    },
    divider: '#a3b8b8',
    background: {
      paper: '#476A7698',
      default: '#080C0E',
    },
  },
});
