import { AppBar } from '@mui/material';
import { useAuth } from '../tools/auth';
import { StyledToolBar } from './NavStyles';
import NavNotLogged from './NavNotLogged';
import Logo from './Logo';
import NavLoggedIn from './NavLoggedIn';

const NavBar = (props: any) => {
  const { mode, setMode } = props;
  const { isAuthenticated } = useAuth();
  return (
    <AppBar elevation={0} position="fixed" enableColorOnDark>
      <StyledToolBar sx={{ height: '60px' }}>
        {/* <Logo /> */}
        {!isAuthenticated() ? (
          <>
            <Logo />
            <NavNotLogged />
          </>
        ) : (
          <>
            <NavLoggedIn mode={mode} setMode={setMode} />
          </>
        )}
      </StyledToolBar>
    </AppBar>
  );
};

export default NavBar;
