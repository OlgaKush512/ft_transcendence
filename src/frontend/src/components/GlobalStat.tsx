import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { users } from '../data/data';
import PointsOfPersonStat from './PointsOfPersonStat';

const GlobalStat = (props: any) => {
  const theUsers = [...users];

  const { xs, md } = props;

  return (
    <>
      <Grid item xs={xs} md={md} p={5} alignItems="center">
        <Paper variant="outlined" sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)'
          }}>
          <Stack>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign={'center'}
              mt={2}
              mb={2}
            >
              Global Stat:
            </Typography>
            <Box
              // border="solid"
              maxHeight="30vh"
              width="100%"
              height="50%"
              sx={{
                overflowY: 'auto',
                m: 'auto',
                backgroundAttachment: 'fixed',
              }}
            >
              <Stack mt={2}>
                {theUsers.map((person, index) => (
                  <PointsOfPersonStat
                    person={person}
                    key={index}
                    isLast={index === theUsers.length - 1}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
};

export default GlobalStat;
