import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogProps } from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import UploadButtons from './UploadButtons';
import { apiAxiosInstance, isAxiosError, myApi } from '../tools/apiHandler';

type UsernameDialogProps = {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
  onUsernameChange: (username: string) => void;
};

const UsernameDialog = (props: UsernameDialogProps) => {
  const [username, setUsername] = useState(props.currentUsername);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameCheckLoading, setIsUsernameCheckLoading] = useState(false);
  const timer = useRef<any>(null);

  const onCheckUserTimeoutCallbackFactory = (username: string) => {
    return async () => {
      setIsUsernameCheckLoading(true);
      if (!isOnlyValidCharacters(username)) {
        setUsernameError('Usernames can only contain letters, numbers and underscores');
        setIsUsernameCheckLoading(false);
        return;
      }
      if (!isValidLength(username)) {
        setUsernameError('Usernames must be between 2 and 20 characters long');
        setIsUsernameCheckLoading(false);
        return;
      }
      const exist =
        username === props.currentUsername
          ? false
          : (await myApi.usersControllerCheckUsername({ username })).data.exist;
      setIsUsernameCheckLoading(false);
      if (exist) setUsernameError('This username is already taken');
    };
  };

  const isOnlyValidCharacters = (str: string) => {
    return /^[a-zA-Z0-9_]*$/.test(str);
  };

  const isValidLength = (str: string) => {
    return str.length >= 2 && str.length <= 20;
  };

  useEffect(() => {
    if (!username) {
      setUsernameError(null);
      return;
    }
    setIsUsernameCheckLoading(true);
    clearTimeout(timer.current);
    setUsernameError(null);
    timer.current = setTimeout(onCheckUserTimeoutCallbackFactory(username), 500);
  }, [username]);

  const send = async () => {
    const formData = new FormData();
    formData.append('username', username!);
    try {
      const response = await apiAxiosInstance.post('/api/users/create-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      props.onUsernameChange(username);
      props.onClose();
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error;
      console.error(error); // might want to catch but should already be checked before sending
    }
  };

  useEffect(() => {
    if (!props.open) return;
    setUsername(props.currentUsername);
    setIsUsernameCheckLoading(false);
    setUsernameError(null);
  }, [props.open, props.currentUsername]);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'xs'}>
      <DialogContent>
        <TextField
          required
          autoFocus
          id="username"
          size="small"
          fullWidth={true}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameError !== null}
          helperText={usernameError}
        />
        <DialogContentText marginTop={'20px'}>
          Usernames can contain only letters, numbers and underscores. Changing your username will also change your
          profile link.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            send();
          }}
          autoFocus
          variant="contained"
          disabled={usernameError !== null || !username.length || isUsernameCheckLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernameDialog;
