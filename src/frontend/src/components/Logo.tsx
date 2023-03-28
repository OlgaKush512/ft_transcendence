import { Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../tools/auth';
import { NavBox, LogoStyle, styleLogoTextMd } from './NavStyles';

const Logo = (props: any) => {
  const { sx } = props;
  const { isAuthenticated } = useAuth();
  return (
    <Box sx={sx}>
      <NavBox flex={1} p={1}>
        <LogoStyle>
          <NavLink
            to={isAuthenticated() ? '/app' : '/'}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src="/Logo50.png" alt="logo" />
          </NavLink>
        </LogoStyle>
        <NavLink
          to={isAuthenticated() ? '/app' : '/'}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography variant="h6" noWrap sx={styleLogoTextMd}>
            TWIN PONG
          </Typography>
        </NavLink>
      </NavBox>
    </Box>
  );
};

export default Logo;
