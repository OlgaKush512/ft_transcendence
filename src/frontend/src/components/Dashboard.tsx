import { Grid } from '@mui/material';
import PeopleOnline from './PeopleOnline';
import StatisticBoard from './StatisticBoard';
import { Container } from '@mui/material';
import { users } from '../data/data';

import {
  sortedPeopleOnline,
  sortPeopleFriend,
  sortPeoplReating,
} from '../tools/statisticFunctions';
import { useContext, useEffect } from 'react';
import { DashboardContext } from '../routes/HomePage';

const Dashboard = () => {
  const { data } = useContext(DashboardContext);
  const usersOnline = sortedPeopleOnline(users);

  const usersOnlineWithOutMe = usersOnline.filter((user) => !user.me);

  const usersOnlineSortedByFriend = sortPeopleFriend(usersOnlineWithOutMe);

  useEffect(() => {
    
  }, [data]);

  return (
    <>
      <Container maxWidth="lg">
        <Grid
          container
          columns={10}
          justifyContent="center"
          mt={10}
          spacing={2}
        >
          <PeopleOnline usersOnlineSortedByFriend={usersOnlineSortedByFriend} />
          <StatisticBoard users={sortPeoplReating(users)} />
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
