import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useContext, useState } from 'react';
import { chatContext } from '../routes/Chat/Layout';
import { myApi } from '../tools/apiHandler';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PositionedMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, setRooms } = useContext(chatContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // const {socket, roomId, rooms, updateRoom, setRooms} = useContext(chatContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [op, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const onLeaveRoom = async () => {
    const response = await myApi.chatControllerLeaveRoom({ roomId: roomId! });
    setRooms((curr) => curr.filter((room) => room.id !== roomId));
    setAnchorEl(null);
    navigate('/app/chat');
  };

  return (
    <div>
      {location.search.includes('id') && (
        <>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ color: 'white', fontSize: 24 }}
            size="small"
            onClick={handleClick}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <MoreHorizIcon />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => onLeaveRoom()}>Leave room</MenuItem>
            <MenuItem
              onClick={() => navigate(`/app/chat/members?id=${roomId}`)}
            >
              Show members
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}
