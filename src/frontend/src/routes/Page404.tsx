import { Grid, Paper, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import RoboAnimation from '../video/animationRobot.gif';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <>
      <Container>
        <Paper
          sx={{
            height: '90vh',
            borderRadius: '16px',
            mt: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.001)',
          }}
          elevation={0}
        >
          <Typography
            variant="h2"
            fontWeight={300}
            p={4}
            alignItems="center"
            textAlign="center"
          >
            PAGE NOT FOUND
          </Typography>
          <Grid container columns={12}>
            <Grid item xs={1} /*border="solid"*/></Grid>
            <Grid
              item
              xs={10}
              /*border="solid"*/
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <img src={RoboAnimation} alt="robot" width="60%" height="auto" />
            </Grid>
            <Grid item xs={1} /*border="solid"*/></Grid>
          </Grid>
          <Stack direction="row" justifyContent="center" p={4}>
            <Typography variant="h4" fontWeight={300}>
              Do you want to go
            </Typography>
            <Typography variant="h4" fontWeight={300} noWrap>
              &nbsp;
            </Typography>
            <Link to={'/app'} style={{ textDecoration: 'none', color: '#000' }}>
              <Typography variant="h4" fontWeight={600}>
                Home?
              </Typography>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default Page404;
