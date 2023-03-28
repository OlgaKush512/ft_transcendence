import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import MatchStat from './MatchStat';

const HistoryOfGame = (props: any) => {
  const { user, myIndex, xs, md } = props;

  return (
    <>
      <Grid item xs={xs} md={md} p={5} alignItems="center">
        <Paper
          variant="outlined"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <Stack>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign={'center'}
              mt={2}
              mb={2}
            >
              History of games:
            </Typography>
            <Box
              // border="solid"
              maxHeight="30vh"
              width="100%"
              height="50%"
              sx={{
                overflowY: 'auto',
                m: 'auto',
              }}
            >
              {/* {user.gameHistory.map()} */}
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
};

export default HistoryOfGame;
