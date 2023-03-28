import {
  Stack,
  Box,
  Avatar,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { users, user } from '../data/data';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import CircleIcon from '@mui/icons-material/Circle';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { myApi } from '../tools/apiHandler';

export function usersFilteredByMyFriends(users: user[]) {
  const theUsers = [...users];
  const result = theUsers.filter((person: user) => person.friend && !person.me);
  return result;
}

export const MyFriend = (props: any) => {
  const { person } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChat = async () => {
    const response = await myApi.chatControllerGetPrivateRoom(
      {
        user: person.username,
      },
      { toastError: true } as any,
    );
    navigate(`/app/chat?id=${response.data}`);
  };

  return (
    <>
      <Grid container columns={8} alignItems="center">
        <Grid item xs={3}>
          <Box flex={1} display="inline-flex" alignItems="center">
            <Link
              to={'/app/users/' + person.username}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Avatar
                sx={{ width: 35, height: 35, m: 1 }}
                src={person.imageUrl}
              ></Avatar>
            </Link>
            <Link
              to={'/app/users/' + person.username}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography>{person.username}</Typography>
            </Link>
            {person.isOnline ? (
              person.inGame ? (
                <SportsCricketIcon sx={{ color: 'brown', width: 20, ml: 1 }} />
              ) : (
                <CircleIcon sx={{ color: 'green', width: 10, ml: 1 }} />
              )
            ) : (
              <CircleIcon sx={{ color: 'red', width: 10, ml: 1 }} />
            )}
            {props.requested && (
              <Chip label="Requested" variant="outlined" sx={{ ml: 1 }} />
            )}
          </Box>
        </Grid>

        <Grid item xs={5} display="flex" justifyContent="flex-end">
          {/* <Typography sx={{ ml: 10, color: 'grey' }}>{person.login}</Typography> */}
          <Typography
            sx={{ ml: 10, width: 100 }}
          >{`Wins: ${person.wins}`}</Typography>
          <Stack direction="row" spacing={1} justifyContent="right" mr={1}>
            <IconButton
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuIcon
                color="secondary"
                sx={{
                  whiteSpace: 'nowrap',
                  display: { xs: 'block', sm: 'none' },
                }}
              />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              sx={{
                whiteSpace: 'nowrap',
                display: { xs: 'none', sm: 'block' },
              }}
              onClick={() => {
                navigate(`/app/game?invite=${person.username}`);
              }}
            >
              Let's Play!
            </Button>
            <Button
              onClick={onChat}
              variant="outlined"
              size="small"
              sx={{
                whiteSpace: 'nowrap',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Let's Chat!
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

const ListOfFriends = (props: any) => {
  useEffect(() => {
    if (!props.data) return;
    
  }, [props.data]);
  if (!props.data) return <></>;
  return (
    <>
      {props.data.friends.map((person: any, index: number) => (
        <div key={`friend-${index}`}>
          <MyFriend person={person} />
          {index !== props.data.length - 1 && <Divider />}
        </div>
      ))}
      {props.data.requested.map((person: any, index: number) => (
        <div key={`friend-${index}`}>
          <MyFriend person={person} requested={true} />
          {index !== props.data.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
};

export default ListOfFriends;
