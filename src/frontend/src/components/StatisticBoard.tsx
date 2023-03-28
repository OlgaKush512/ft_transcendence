import { Paper, Grid, Box } from '@mui/material';
import GlobalStat from './GlobalStat';
import HistoryOfGame from './HistoryOfGame';
import YouAreNumber from './YouAreNumber';
import { myRate } from '../tools/statisticFunctions';
import { useContext } from 'react';
import { DashboardContext } from '../routes/HomePage';

const StatisticBoard = (props: any) => {
  const { users } = props;
  const { data } = useContext(DashboardContext);

  return (
    <>
      <Grid item xs={10} minHeight="40vh" gap={3}>
        <Paper elevation={1} sx={{ borderRadius: '4px 4px 16px 16px' }}>
          <Box overflow="auto" justifyContent="space-between">
            <Grid
              container
              columns={9}
              sx={{ flexDirection: { xs: 'column', md: 'row' } }}
            >
              <YouAreNumber myIndex={data ? (data as any).rank : ''} />
              {/* <HistoryOfGame users={users} myIndex={myIndex} sx={9} md={3} />
              <GlobalStat key={myIndex} xs={9} md={3} /> */}
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default StatisticBoard;
