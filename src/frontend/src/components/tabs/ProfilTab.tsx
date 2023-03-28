import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { useContext, useState } from 'react';
import { profileContext, useProfileContext } from '../ProfilePage';
import UsernameDialog from '../UsernameDialog';
import { useAuth } from '../../tools/auth';

const ProfileTab = () => {
  const { setUser } = useAuth();
  const { isLoading, profile, refetch, isFetching } =
    useContext(profileContext);
  const [usernameDialog, setUsernameDialog] = useState(false);

  const onUsernameChange = (username: string) => {
    refetch();
    setUser((curr) => (curr ? { ...curr, username: username } : null));
  };

  if (isLoading || profile === undefined)
    return (
      <Box sx={{}}>
        <CircularProgress />
      </Box>
    );
  else
    return (
      <Box sx={{ width: '80%', m: 'auto' }}>
        <Grid container columns={10} my={4}>
          <Grid item xs={5} textAlign="left">
            <Typography>username:</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>{profile?.username}</Typography>
          </Grid>
          <Grid item xs={1} display="flex" justifyContent="left">
            <Button
              aria-label="edit"
              size="small"
              onClick={() => setUsernameDialog(true)}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
        <Grid container columns={10} my={4}>
          <Grid item xs={5} textAlign="left">
            <Typography>name:</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>{profile?.firstName}</Typography>
          </Grid>
        </Grid>
        <Grid container columns={10} my={4}>
          <Grid item xs={5} textAlign="left">
            <Typography>surname:</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>{profile?.lastName}</Typography>
          </Grid>
        </Grid>
        <Grid container columns={10} my={4}>
          <Grid item xs={5} textAlign="left">
            <Typography>intra:</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Button
              variant="text"
              href={'https://profile.intra.42.fr/users/' + profile?.login}
              target="_blank"
            >
              intra42
            </Button>
          </Grid>
        </Grid>
        <UsernameDialog
          currentUsername={profile?.username!}
          onClose={() => {
            setUsernameDialog(false);
          }}
          open={usernameDialog}
          onUsernameChange={onUsernameChange}
        />
      </Box>
    );
};

export default ProfileTab;
