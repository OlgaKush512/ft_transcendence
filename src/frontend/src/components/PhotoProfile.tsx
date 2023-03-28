import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { profileContext, useProfileContext } from './ProfilePage';
import UploadButtons from './UploadButtons';
import { darkTheme, theme } from '../mainTheme';
import { useAuth } from '../tools/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiAxiosInstance, myApi } from '../tools/apiHandler';

// export const UploadButtons = (
//   variantOfButton: 'text' | 'outlined' | 'contained'
// ) => {
//   const colorText =
//     variantOfButton === 'contained'
//       ? 'palette.primary.contrastText'
//       : 'palette.primary.main';
//   return (
//     <Stack direction="row" alignItems="center" spacing={2} mt="30px">
//       <Button
//         variant={variantOfButton}
//         component="label"
//         sx={{ color: colorText }}
//       >
//         Change Image
//         <input hidden accept="image/*" multiple type="file" />
//       </Button>
//     </Stack>
//   );
// };

const PhotoProfile = (props: {
  person: {
    imageUrl: string;
    username: string;
    isFriend: boolean;
    isBlocked: boolean;
    isRequested: boolean;
  };
  mode: any;
  isLoading?: boolean;
  refetch?: any;
}) => {
  const { person, mode } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user, setUser } = useAuth();
  const location = useLocation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const sendFile = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile!);
    const response = await apiAxiosInstance.post(
      '/api/users/update-photo',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    if (props.refetch) props.refetch();
    const profileResponse = await myApi.usersControllerGetProfile();
    setUser(profileResponse.data);
  };

  useEffect(() => {
    if (!selectedFile) return;
    sendFile();
  }, [selectedFile]);

  const isMe = () => {
    return user?.username === person.username;
  };

  useEffect(() => {
  }, [props.isLoading]);

  const navigate = useNavigate();

  const onChat = async () => {
    const response = await myApi.chatControllerGetPrivateRoom(
      {
        user: person.username,
      },
      { toastError: true } as any,
    );
    navigate(`/app/chat?id=${response.data}`);
  };

  const onAddFriend = async () => {
    handleClose();
    const response = await myApi.usersControllerRequestFriend(
      {
        username: person.username,
      },
      { toastError: true } as any,
    );
    if (props.refetch) props.refetch();
  };

  const onBlock = async () => {
    handleClose();
    const response = await myApi.usersControllerBlock(
      {
        username: person.username,
      },
      { toastError: true } as any,
    );
    if (props.refetch) props.refetch();
  };

  const onUnblock = async () => {
    handleClose();
    const response = await myApi.usersControllerUnblock(
      {
        username: person.username,
      },
      { toastError: true } as any,
    );
    if (props.refetch) props.refetch();
  };

  const onRemoveFriend = async () => {
    handleClose();
    const response = await myApi.usersControllerRemoveFriend(
      {
        username: person.username,
      },
      { toastError: true } as any,
    );
    if (props.refetch) props.refetch();
  };

  // 'linear-gradient(#501c00, #b6916f, #9a6350, #f7b197, #f6ead5)'
  // `linear-gradient(${theMode.palette.background.default}, ${theMode.palette.primary.main}, ${theMode.palette.primary.main}, ${theMode.palette.primary.contrastText}, ${theMode.palette.background.default})`
  // const { isLoading, profile, refetch } = useContext(profileContext);
  // const [usernameDialog, setUsernameDialog] = useState(false);

  const theMode = mode === 'light' ? theme : darkTheme;

  if (props.isLoading)
    return (
      <Grid item xs={10} sm={4}>
        <Box
          sx={{
            borderRadius: '16px 0 0 16px',
            display: 'flex',
            height: '100%',
            minHeight: { xs: '40vh', sm: '90vh' },
            backgroundImage: `linear-gradient(${theMode.palette.background.default}, ${theMode.palette.primary.main}, ${theMode.palette.primary.main}, ${theMode.palette.primary.contrastText}, ${theMode.palette.background.default})`,
            backgroundSize: 'cover',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></Box>
      </Grid>
    );

  return (
    <>
      <Grid item xs={10} sm={4}>
        <Box
          sx={{
            borderRadius: '16px 0 0 16px',
            display: 'flex',
            height: '100%',
            minHeight: { xs: '40vh', sm: '90vh' },
            backgroundImage: `linear-gradient(${theMode.palette.background.default}, ${theMode.palette.primary.main}, ${theMode.palette.primary.main}, ${theMode.palette.primary.contrastText}, ${theMode.palette.background.default})`,
            backgroundSize: 'cover',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* {isLoading || profile === undefined ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : (
            <Box> */}
          <Grid container columns={4}>
            <Grid item xs={4} display="flex" justifyContent="center">
              <Avatar
                sx={{
                  width: { xs: '80%', md: '80%' },
                  height: 'auto',
                }}
                src={person.imageUrl}
              />
            </Grid>
            {isMe() && location.pathname === '/app/profile/' && (
              <Grid item xs={4} display="flex" justifyContent="center">
                {
                  <UploadButtons
                    variantOfButton="outlined"
                    onChange={(e) => setSelectedFile(e.target.files![0])}
                  />
                }
              </Grid>
            )}
            {!isMe() && person.isFriend && (
              <Grid item xs={4} display="flex" justifyContent="center">
                <Stack direction="row" spacing={3} mt="10px">
                  <Chip
                    label="Friend"
                    variant="outlined"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Stack>
              </Grid>
            )}
            {!isMe() && person.isRequested && (
              <Grid item xs={4} display="flex" justifyContent="center">
                <Stack direction="row" spacing={3} mt="10px">
                  <Chip
                    label="Requested"
                    variant="outlined"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Stack>
              </Grid>
            )}
            {!isMe() &&
              !person.isFriend &&
              !person.isRequested &&
              !person.isBlocked && (
                <Grid item xs={4} display="flex" justifyContent="center">
                  <Stack direction="row" spacing={3} mt="10px">
                    <Chip
                      label="Not Friend"
                      variant="outlined"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    />
                  </Stack>
                </Grid>
              )}
            {!isMe() && person.isBlocked && (
              <Grid item xs={4} display="flex" justifyContent="center">
                <Stack direction="row" spacing={3} mt="10px">
                  <Chip
                    label="Blocked"
                    variant="outlined"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Stack>
              </Grid>
            )}
            {!isMe() && (
              <>
                <Grid
                  item
                  xs={4}
                  display="flex"
                  justifyContent="center"
                  mt="60px"
                >
                  <Stack direction="row" spacing={3}>
                    <Button
                      variant="outlined"
                      sx={{ whiteSpace: 'nowrap' }}
                      onClick={() => {
                        navigate(`/app/game?invite=${person.username}`);
                      }}
                    >
                      Let's Play!
                    </Button>
                    <Button
                      onClick={onChat}
                      variant="outlined"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Let's Chat!
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
          {/* </Box> */}
          {/* )} */}
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {!person.isBlocked &&
            (person.isFriend || person.isRequested) && [
              <MenuItem onClick={onRemoveFriend} key={1}>
                Remove
              </MenuItem>,
              <MenuItem onClick={onBlock} key={2}>
                Block
              </MenuItem>,
            ]}
          {!person.isBlocked &&
            !(person.isFriend || person.isRequested) && [
              <MenuItem onClick={onAddFriend} key={1}>
                Add
              </MenuItem>,
              <MenuItem onClick={onBlock} key={2}>
                Block
              </MenuItem>,
            ]}
          {person.isBlocked && <MenuItem onClick={onUnblock}>Unblock</MenuItem>}
        </Menu>
      </Grid>
    </>
  );
};

export default PhotoProfile;
