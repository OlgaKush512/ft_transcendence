import { IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { MyButton } from './NavStyles';

const NavNotLogged = () => {
  const navigate = useNavigate();

  const [anchorElLeftMenu, setAnchorElLeftMenu] = useState<null | HTMLElement>(
    null,
  );
  const open = Boolean(anchorElLeftMenu);
  const handleClickLeftMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLeftMenu(event.currentTarget);
  };
  const handleCloseLeftMenu = () => {
    setAnchorElLeftMenu(null);
  };

  return (
    <>
      <NavLink to="/team" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MyButton variant="text">About</MyButton>
      </NavLink>

      <Box
        sx={{
          flexGrow: 1,
        }}
      ></Box>
      <IconButton
        sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickLeftMenu}
      >
        <MenuIcon sx={{ color: 'primary.contrastText' }} />
      </IconButton>

      <NavLink to="/app" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MyButton variant="contained" onClick={() => navigate('/app')}>
          Sign Up
        </MyButton>
      </NavLink>
      {/* <MyButton variant="contained">Sign Up</MyButton> */}
      <Menu
        id="basic-menu"
        anchorEl={anchorElLeftMenu}
        open={open}
        onClose={handleCloseLeftMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <NavLink
          to="/team"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MenuItem onClick={handleCloseLeftMenu}>About</MenuItem>
        </NavLink>

        <NavLink to="/app" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleCloseLeftMenu}>Sign Up</MenuItem>
        </NavLink>
      </Menu>
    </>
  );
};

export default NavNotLogged;
