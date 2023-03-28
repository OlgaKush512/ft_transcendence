import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/system';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import GameCardAction from './GameCardAction';
import PongClassic from '../images/PongClassic.jpg';
import BonusGame from '../images/BonusGame.jpg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { myApi } from '../tools/apiHandler';
import { FriendData } from '../tools/api.autogenerated';
import PersonToInvite from './PersonToInvite';
import { io } from 'socket.io-client';
import { useAuth } from '../tools/auth';

type UsersToInvite = FriendData & {
  status: ('friend' | 'online' | 'inGame')[];
  invited: boolean;
  rejected: boolean;
  id: number;
};

type QueueState = 'DISCONNECTED' | 'CONNECTING' | 'WAITING_FOR_OPPONENT';

type UserAlreadyConnectedDialogProps = {
  open: boolean;
  onClose?: () => void;
};

const UserAlreadyConnectedDialog: FC<UserAlreadyConnectedDialogProps> = memo(
  (props) => {
    const navigate = useNavigate();
    return (
      <Dialog onClose={props.onClose} open={props.open}>
        <DialogTitle>You are already connected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Make sure that you are not already connected or in game on another
            page and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => navigate('/app')}>
            Return to Home page
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

type GameTypeDialogProps = {
  open: boolean;
  onConfirm: (type: 'classic' | 'bonus') => void;
  username: string;
};

const GameTypeDialog: FC<GameTypeDialogProps> = memo((props) => {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<'classic' | 'bonus' | null>(null);
  return (
    <Dialog open={props.open}>
      <DialogTitle>Game Mode Selection</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: '10px' }}>
          Select a game mode to play with <strong>{props.username}</strong>
        </DialogContentText>
        <div style={{ display: 'flex', gap: '20px' }}>
          <GameCardAction
            image={PongClassic}
            alt="Classic Game"
            onClick={() => {
              setGameType('classic');
            }}
            selected={gameType === 'classic'}
          />

          <GameCardAction
            image={BonusGame}
            alt="Bonus Game"
            onClick={() => {
              setGameType('bonus');
            }}
            selected={gameType === 'bonus'}
          />
        </div>
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          disabled={!gameType}
          onClick={() => props.onConfirm(gameType || 'classic')}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const socket = io('http://localhost:5000/matchmaking', {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

const PageLobby = () => {
  const { triggerLogin } = useAuth();
  const [inQueue, setInQueue] = useState(false);
  const [defaultInvitationSent, setDefaultInvitationSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<UsersToInvite[]>([]);
  const [gameType, setGameType] = useState<'classic' | 'bonus' | null>(null);
  const [queueState, setQueueState] = useState<QueueState>('DISCONNECTED');
  const [showAlreadyConnectedDialog, setShowAlreadyConnectedDialog] =
    useState(false);
  const [showGameTypedDialog, setShowGameTypedDialog] = useState(false);
  const navigate = useNavigate();
  const [playerLeft, setPlayerLeft] = useState(false);
  const [noWinner, setNoWinner] = useState(false);
  let winner = useParams<string>().winner;

  const { isLoading, error, data } = useQuery(
    'repoData',
    () => myApi.appControllerGetUsersStatus(),
    { cacheTime: 0, refetchInterval: 5000 },
  );

  useEffect(() => {
    if (!data) return;
    const newUsers = users;
    (data.data.merged as any).forEach((user: any) => {
      const idx = newUsers.findIndex((u) => u.id === user.id)
      if (idx < 0)
        newUsers.push({ ...user, invited: false });
      else {
        newUsers[idx] = {...user, invited: newUsers[idx].invited}
      }
    });
    setUsers(newUsers.filter((user: any) => user.status.includes('online')));
  }, [data]);

  useEffect(() => {
    if (!users.length) return;
    if (defaultInvitationSent) return;
    if (searchParams.has('invite')) {
      setShowGameTypedDialog(true);
    }
  }, [searchParams, users, defaultInvitationSent]);

  const onTypeDialogConfirm = async (type: 'classic' | 'bonus') => {
    setShowGameTypedDialog(false);
    setGameType(type);
    setDefaultInvitationSent(true);
    const username = searchParams.get('invite')!;
    if (username) {
      const response = await myApi.usersControllerGetOtherProfile(username);
      //get user data
      sendInvitation(
        {
          imageUrl: response.data.imageUrl,
          invited: false,
          rejected: false,
          status: response.data.isFriend ? ['online', 'friend'] : ['online'],
          username: username,
          id: 0
        },
        type,
      );
    }
  };

  const joinQueue = async () => {
    setInQueue(true);
    setQueueState('WAITING_FOR_OPPONENT');
    socket.emit('ENTER_QUEUE', gameType);
  };

  const leaveQueue = async () => {
    setInQueue(false);
    socket.emit('LEAVE_QUEUE');
    setQueueState('DISCONNECTED');
  };

  const onGameFound = useCallback(({ id }: { id: string }) => {
    socket.disconnect();
    setTimeout(() => {
      navigate(`/app/game/${id}`);
    }, 1000);
  }, []);

  const onInvitationAccepted = useCallback((data: any) => {
    socket.disconnect();
    setTimeout(() => {
      navigate(`/app/game/${data.gameId}`);
    }, 1000);
  }, []);

  const onInvitationRejected = (data: any) => {
    const user = users.find((u) => u.username === data.by.username);
    if (user) {
      setUsers((curr) =>
        curr.map((u) =>
          u.username === user.username
            ? { ...u, rejected: true, invited: false }
            : u,
        ),
      );
    }
  };

  const onInvitationCanceled = (data: any) => {
    const user = users.find((u) => u.username === data.username);
    if (user) {
      setUsers((curr) =>
        curr.map((u) =>
          u.username === user.username ? { ...u, invited: false } : u,
        ),
      );
    }
  };

  const onConnectionError = useCallback((err: Error) => {
    if (err.message === 'Invalid or missing token') triggerLogin();
    else if (err.message === 'User is already connected')
      setShowAlreadyConnectedDialog(true);
    else console.error(err);
  }, []);

  const onConnect = useCallback(() => {
    setShowAlreadyConnectedDialog(false);
  }, []);

  const gameChoiceDisabled = useMemo(() => {
    if (inQueue) return true;
    if (users.find((user) => user.invited) !== undefined) return true;
    if (
      searchParams.has('gameType') &&
      ['classic', 'bonus'].includes(searchParams.get('gameType')!)
    )
      return true;
    return false;
  }, [searchParams, inQueue, users]);

  const onQueueBtn = () => {
    if (inQueue) {
      leaveQueue();
      setInQueue(false);
    } else {
      joinQueue();
      setInQueue(true);
    }
  };

  const sendInvitation = async (
    user: UsersToInvite,
    type: 'classic' | 'bonus',
  ) => {
    await myApi.matchmakingControllerSendInvitation({
      username: user.username,
      gameType: type,
    });
    setUsers((curr) =>
      curr.map((u) =>
        u.username === user.username ? { ...u, invited: true } : u,
      ),
    );
  };

  const cancelInvitation = async (user: UsersToInvite) => {
    await myApi.matchmakingControllerCancelInvitation({
      username: user.username,
      gameType: gameType || 'classic',
    });
  };

  const onInvitedUserBtn = async (user: UsersToInvite) => {
    if (user.invited) cancelInvitation(user);
    else sendInvitation(user, gameType || 'classic');
  };

  useEffect(() => {
    if (winner === 'left') setPlayerLeft(true);
    else if (!winner) setNoWinner(true);
  }, [winner]);

  useEffect(() => {
    socket.on('GAME_FOUND', onGameFound);
    socket.on('ACCEPTED_INVITATION', onInvitationAccepted);
    socket.on('REJECTED_INVITATION', onInvitationRejected);
    socket.on('CANCELED_INVITATION', onInvitationCanceled);
    socket.on('connect_error', onConnectionError);
    socket.on('connect', onConnect);

    socket.on('disconnect', () => console.log('disconnect'));
    if (!socket.connected) socket.connect();
    return () => {
    };
  }, []);

  return (
    <>
      <Container>
        <Paper sx={{ minHeight: '90vh', borderRadius: '16px' }} elevation={1}>
          <Grid container columns={11} mt={10} p={5}>
            <Grid
              item
              xs={11}
              md={5}
              sx={{
                // height: { xs: '20vh', md: '80vh' },
                borderRadius: '16px',
              }}
              // border="solid"
            >
              {playerLeft ? (
                <p>Player left</p>
              ) : noWinner ? (
                <p> </p>
              ) : (
                <p>{winner} won this match!</p>
              )}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '16px ',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: '100%',
                }}
              >
                <Grid container columns={12} pt={4} pb={10} rowGap={6}>
                  <Grid item md={2} />
                  <Grid item xs={5} md={8} sx={{ pl: { xs: 2, md: 0 } }}>
                    <GameCardAction
                      image={PongClassic}
                      alt="Classic Game"
                      onClick={() => {
                        setGameType('classic');
                      }}
                      selected={gameType === 'classic'}
                      disabled={gameChoiceDisabled}
                    />
                  </Grid>
                  <Grid item md={2} />

                  <Grid item xs={2} />
                  <Grid item xs={5} md={8} sx={{ pr: { xs: 2, md: 0 } }}>
                    <GameCardAction
                      image={BonusGame}
                      alt="Bonus Game"
                      onClick={() => {
                        setGameType('bonus');
                      }}
                      selected={gameType === 'bonus'}
                      disabled={gameChoiceDisabled}
                    />
                  </Grid>
                  <Grid item md={2} />
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={11} md={1} sx={{ my: { xs: 2, md: 'none' } }}></Grid>
            <Grid
              item
              xs={11}
              md={5}
              sx={{
                // height: { xs: '60vh', md: '80vh' },
                borderRadius: '16px',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '16px ',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: '100%',
                }}
              >
                <Grid container columns={1}>
                  <Grid item xs={1} display="flex" justifyContent="center">
                    <Typography variant="h6" fontWeight={300} p={4}>
                      People to Invite:
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  columns={12}
                  sx={{
                    overflowY: 'auto',
                    maxHeight: { xs: '28vh', md: '100vh' },
                  }}
                >
                  <Grid item xs={1}></Grid>
                  <Grid item xs={10}>
                    {users.map((user, index, arr) => (
                      <PersonToInvite
                        key={user.username}
                        person={user}
                        isLast={index === arr.length - 1}
                        invited={user.invited}
                        rejected={user.rejected}
                        onButtonClick={() => {
                          onInvitedUserBtn(user);
                        }}
                        disabled={inQueue || !gameType}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
                <Grid container columns={1}>
                  <Grid mt={4} item xs={1}>
                    <Typography
                      variant="h4"
                      fontWeight={400}
                      textAlign="center"
                    >
                      OR
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container columns={12} mt={4} pb={10}>
                  <Grid item xs={1} />
                  <Grid item xs={10} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      onClick={onQueueBtn}
                      size="large"
                      disabled={
                        users.find((user) => user.invited) !== undefined ||
                        !gameType
                      }
                    >
                      {inQueue ? 'Leave Queue' : 'Join Queue'}
                    </Button>
                  </Grid>
                  <Grid item xs={1} />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <UserAlreadyConnectedDialog
        onClose={undefined}
        open={showAlreadyConnectedDialog}
      />
      {showGameTypedDialog && (
        <GameTypeDialog
          onConfirm={onTypeDialogConfirm}
          open={true}
          username={searchParams.get('invite')!}
        />
      )}
    </>
  );
};

export default PageLobby;
