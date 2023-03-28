import { Box, Button, styled, Toolbar } from '@mui/material';

export const StyledToolBar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

export const NavBox = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'theme.palette.primary.main',
});

export const styleLogoTextMd = {
  mr: 2,
  alignItems: 'center',
  display: { xs: 'none', sm: 'block' },
  fontFamily: 'Racing Sans One',
  fontWeight: 1000,
  letterSpacing: '.3rem',
  color: 'secondary.main',
  textDecoration: 'none',
  paddingLeft: '8px',
};

export const LogoStyle = styled(Box)(({ theme }) => ({
  mr: '1',
  gap: '20px',
  alignItems: 'center',
}));

export const MyButton = styled(Button)(({ theme }) => {
  return {
    alignItems: 'center',
    display: 'none',
    whiteSpace: 'nowrap',
    marginLeft: 5,
    my: 2,
    color: theme.palette.primary.contrastText,
    disableElevation: 'true',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  };
});

export const Search = styled('div')(({ theme }) => ({
  display: 'none',
  backgroundColor: theme.palette.background.paper,
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

export const Icons = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: 'none',
  gap: '30px',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
