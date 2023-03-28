import { Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import GlobalStat from '../GlobalStat';
import { profileContext } from '../ProfilePage';

const StatTab = () => {
  const { isLoading, profile, refetch } = useContext(profileContext);
  if (profile)
    return (
      <Grid container columns={9}>
        <Grid container columns={8} my="30px">
          <Grid item xs={1} />
          <Grid item xs={2} textAlign="left">
            <Typography>games: </Typography>
            <Typography>{(profile.stats as any).played}</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>wins: </Typography>
            <Typography>{(profile.stats as any).wins}</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>loses: </Typography>
            <Typography>{(profile.stats as any).loses}</Typography>
          </Grid>
          <Grid item xs={2} textAlign="left">
            <Typography>points: </Typography>
            <Typography>{(profile.stats as any).points}</Typography>
          </Grid>
        </Grid>
        <Grid container columns={8} my="30px">
          <Grid item xs={3} />
          <Grid item xs={2} textAlign="left">
            <Typography>Ladder level: </Typography>
            <Typography>{(profile as any).rank}</Typography>
          </Grid>
        </Grid>
        {/* <GlobalStat sx={9} md={9} /> */}
      </Grid>
    );
  return <></>;
};

export default StatTab;
