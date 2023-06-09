import { Container, Grid, Paper } from '@mui/material';
import InfoProfile from './InfoProfile';
import PhotoProfile from './PhotoProfile';
import { users } from '../data/data';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { myApi } from '../tools/apiHandler';
import { UserGetProfileResponseDTO } from '../tools/api.autogenerated';

type UserProfile = {
  username: string;
  login: string;
  firstName: string;
  lastName: string;
  imageUrl: string; // <== L'URL de la photo de profile est la
  stats: any;
  gameHistory: any;
  // isFriend?: boolean;
  // isBlocked?: boolean;
};

type ProfileContext = {
  profile?: UserGetProfileResponseDTO;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

export const profileContext = createContext<ProfileContext>({
  isLoading: true,
  refetch: () => {},
  isFetching: true,
});
export const useProfileContext = () => useContext(profileContext);

const me = { ...users.find((person) => person.me === true) };

const ProfilePage = (props: any) => {
  const { mode } = props;
  const [profileData, setProfileData] = useState<
    UserGetProfileResponseDTO | undefined
  >(undefined);
  const { data, isLoading, refetch, isFetching } = useQuery(
    'profile',
    () => myApi.usersControllerGetProfile(),
    { refetchOnWindowFocus: false, cacheTime: 0 },
  );

  useEffect(() => {
    if (data) setProfileData(data.data);
  }, [data]);

  return (
    <>
      <profileContext.Provider
        value={{ isLoading, profile: profileData, refetch, isFetching }}
      >
        {profileData && (
          <Container>
            <Paper
              elevation={1}
              sx={{
                minHeight: { xs: '40vh', md: '90vh' },
                borderRadius: '16px',
              }}
            >
              <Grid container columns={10} mt={10}>
                <PhotoProfile
                  person={profileData}
                  mode={mode}
                  isLoading={isFetching}
                  refetch={refetch}
                />
                {/* <Grid item xs={0} md={1} /> */}
                <InfoProfile />
              </Grid>
            </Paper>
          </Container>
        )}
      </profileContext.Provider>
    </>
  );
};

export default ProfilePage;
