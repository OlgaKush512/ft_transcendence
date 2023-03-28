import { Button, Box } from '@mui/material';
import { useContext, useState } from 'react';
import { profileContext } from '../ProfilePage';
import { myApi } from '../../tools/apiHandler';

const SettingsTab = () => {
  const { isLoading, profile, refetch, isFetching } =
    useContext(profileContext);

  const enable2FA = async () => {
    const response = await myApi.usersControllerEnable2Fa();
    refetch();
  };

  const disable2FA = async () => {
    const response = await myApi.usersControllerDisable2Fa();
    refetch();
  };

  if (isLoading) return <></>;

  return (
    <>
      <Box sx={{ width: '100%' }} textAlign="center" mt="50px">
        {profile?.twoFactorAuthEnabled ? (
          <Button variant="contained" onClick={disable2FA}>
            Disable Two Factor Authentication
          </Button>
        ) : (
          <Button variant="contained" onClick={enable2FA}>
            Enable Two Factor Authentication
          </Button>
        )}
      </Box>
    </>
  );
};

export default SettingsTab;
