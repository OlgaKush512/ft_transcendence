import { Divider, Grid, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const MatchStat = (props: any) => {
  const { match, person, isLast } = props;

  return (
    <>
      <Grid container columns={6} alignItems="center">
        <Grid item xs={2} textAlign="right">
          <Link
            to={'/app/users/' + person.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography>{person.username}</Typography>
          </Link>
        </Grid>
        <Grid item xs={1} textAlign="center">
          <Paper elevation={0} sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)'
          }}>
            {match.isWin ? match.pointsWin : match.pointsLost}
          </Paper>
        </Grid>
        <Grid item xs={1} textAlign="center">
          <Paper elevation={0} sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)'
          }}>
            {match.isWin ? match.pointsLost : match.pointsWin}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Link
            to={'/app/users/' + match.opponent}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography>{match.opponent}</Typography>
          </Link>
        </Grid>
      </Grid>
      {!isLast && <Divider />}
    </>
  );
};

export default MatchStat;
