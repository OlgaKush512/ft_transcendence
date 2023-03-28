import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { user, users } from '../data/data';
import MatchToWatch from './MatchToWatch';
import { useQuery } from 'react-query';
import { myApi } from '../tools/apiHandler';
import { useEffect, useState } from 'react';

export interface match {
  playerOne: user;
  playerTwo: user;
}

export const matches: match[] = [
  { playerOne: users[0], playerTwo: users[2] },
  { playerOne: users[3], playerTwo: users[9] },
];

export type Game = {
  player1: { username: string; imageUrl: string };
  player2: { username: string; imageUrl: string };
  id: string;
};
const WatchTheGame = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { isLoading, error, data } = useQuery('ongoinggames', () =>
    myApi.usersControllerGetOngoingGames(),
  );

  useEffect(() => {
    if (!data) return;
    setGames(data.data as any);
  }, [data]);

  return (
    <>
      <Container maxWidth="lg">
        <Grid item xs={10} justifyContent="center" mt={10}>
          <Paper
            sx={{
              minHeight: { xs: '90vh' },
              borderRadius: '16px',
            }}
            elevation={1}
          >
            <Typography variant="h6" fontWeight={300} p={4} textAlign="center">
              Ongoing Matches:
            </Typography>
            <Box
              width="98%"
              sx={{ overflowY: 'auto' }}
              justifyContent="center"
              ml={1}
            >
              <Stack mt={2}>
                {games.map((game, index) => (
                  <MatchToWatch
                    match={game}
                    key={index}
                    isLast={index === games.length - 1}
                  />
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Container>
    </>
  );
};

export default WatchTheGame;
