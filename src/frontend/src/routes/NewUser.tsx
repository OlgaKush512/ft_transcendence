import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadButtons from '../components/UploadButtons';
import { apiAxiosInstance, isAxiosError, myApi } from '../tools/apiHandler';
import { useAuth } from '../tools/auth';

const NewUser = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameCheckLoading, setIsUsernameCheckLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { setUser, setAuthState, signIn } = useAuth();
  const timer = useRef<any>(null);
  const navigate = useNavigate();

  // useLayoutEffect(() => {
  //   (async () => {
  //     if ((await myApi.usersControllerCheckInitialized()).data.isInitialized)
  //       navigate('/app');
  //   })();
  // });

  useEffect(() => {
    if (!username) return;
    clearTimeout(timer.current);
    setUsernameError(null);
    timer.current = setTimeout(
      onCheckUserTimeoutCallbackFactory(username),
      500,
    );
  }, [username]);

  const onCheckUserTimeoutCallbackFactory = (username: string) => {
    return async () => {
      setIsUsernameCheckLoading(true);
      if (!isOnlyValidCharacters(username)) {
        setUsernameError('usernames can only contain letters, numbers and _');
        setIsUsernameCheckLoading(false);
        return;
      }
      if (!isValidLength(username)) {
        setUsernameError('usernames must be between 2 and 20 characters long');
        setIsUsernameCheckLoading(false);
        return;
      }
      const exist = (await myApi.usersControllerCheckUsername({ username }))
        .data.exist;
      setIsUsernameCheckLoading(false);
      if (exist) setUsernameError('this username is already taken');
    };
  };

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const isOnlyValidCharacters = (str: string) => {
    return /^[a-zA-Z0-9_]*$/.test(str);
  };

  const isValidLength = (str: string) => {
    return str.length >= 2 && str.length <= 20;
  };

  const send = async () => {
    const formData = new FormData();
    formData.append('username', username!);
    if (selectedFile) formData.append('image', selectedFile);
    try {
      const response = await apiAxiosInstance.post(
        '/api/users/create-profile',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      const data = await myApi.usersControllerGetProfile();
      // setUser(data.data);
      signIn(data.data);

      navigate('/app', { state: { state: { state: 'AUTHENTICATED' } } });
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error;
      console.error(error); // might want to catch but should already be checked before sending
    }
  };

  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Welcome!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you want to continue, choose your username.
          </DialogContentText>
          <TextField
            sx={{ height: '60px' }}
            required
            autoFocus
            variant="outlined"
            margin="dense"
            id="username"
            size="small"
            label="username"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError !== null}
            helperText={usernameError}
          />
          {isUsernameCheckLoading ? 'loading' : ''}
          <DialogContentText id="alert-dialog-description">
            You can also upload a new photo.
          </DialogContentText>
          {
            <UploadButtons
              variantOfButton="outlined"
              onChange={(e) => setSelectedFile(e.target.files![0])}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button
            onClick={send}
            autoFocus
            variant="contained"
            disabled={usernameError !== null || username === null}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewUser;
