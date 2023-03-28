import { sumOfPoints } from '../tools/statisticFunctions';
import { Avatar, Divider, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PointsOfPersonStat = (props: any) => {
  const { person, isLast } = props;

  return (
    <>
      <Grid container columns={10} alignItems="center">
        <Grid item xs={1} display="flex" justifyContent="center" my={1}>
          <Link
            to={'/app/users/' + person.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Avatar sx={{ width: 25, height: 25 }} src={person.img}></Avatar>
          </Link>
        </Grid>
        <Grid item xs={3} textAlign="left">
          <Link
            to={'/app/users/' + person.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography>{person.username}</Typography>
          </Link>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ mr: '10px' }} textAlign="left">
            Points: {sumOfPoints(person)}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography sx={{ mr: '10px' }} textAlign="left">
            Wins: {person.win}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography sx={{ mr: '10px' }}>
            Lost: {person.numbeGame - person.win}
          </Typography>
        </Grid>
      </Grid>
      {!isLast && <Divider />}
    </>
  );
};

export default PointsOfPersonStat;
