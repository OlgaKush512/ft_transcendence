import { Grid, Paper, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import RoboAnimation from '../assets/img/astrojamPpacity.gif';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const UnexpectedError = () => {
  const theTheme = useTheme();

  return (
    <>
      <Container>
        <Paper
          sx={{
            height: '90vh',
            borderRadius: '16px',
            mt: 10,
            backgroundColor: `
            ${
              theTheme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.001)'
                : 'rgba(255, 255, 255, 0.1)'
            }
            `,
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
            Oops, something weird happened. We are fixing the problem.
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

export default UnexpectedError;
