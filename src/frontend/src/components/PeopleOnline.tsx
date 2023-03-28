import { Box } from '@mui/material';
import { Grid, Paper, Typography } from '@mui/material';
import PersonOnline from './PersonOnline';
import { useContext } from 'react';
import { DashboardContext } from '../routes/HomePage';

const PeopleOnline = (props: any) => {
  const { data } = useContext(DashboardContext);
  const { usersOnlineSortedByFriend } = props;
  return (
    <>
      <Grid item xs={10} minHeight="40vh" justifyContent="center">
        <Paper
          sx={{
            height: '40vh',
            borderRadius: '16px 16px 4px 4px ',
            // opacity: '0.7',
            // backgroundColor: 'rgba(255, 255, 255, 0.7)'
          }}
          elevation={1}
        >
          <Box>
            <Typography variant="h6" fontWeight={300} p={4}>
              People Online:
            </Typography>
            <Box
              maxHeight="28vh"
              width="98%"
              sx={{ overflowY: 'auto' }}
              justifyContent="center"
              ml={1}
            >
              {data?.merged.map((person: any, index: number) => (
                <PersonOnline
                  key={person.username}
                  person={person}
                  isLast={index === data?.merged.length - 1}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default PeopleOnline;
