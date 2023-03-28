import GamePage from './game';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Manager } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StyledToolBar } from '../../components/NavStyles';
import { myApi } from '../../tools/apiHandler';
import { useAuth } from '../../tools/auth';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, DialogActions, Button } from '@mui/material';
import PageLobby from '../../components/PageLobby';

/*  ********************************************************************************
    this is the starter page of the game. Here you can chose between solo game, duo game or watch a live game.
    You will then be transfered in a lobby/waitingroom/lobby with another player -> <GamePage/> will be shown
    ******************************************************************************** */

const socket = io('http://localhost:5000/matchmaking', {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

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

type QueueState = 'DISCONNECTED' | 'CONNECTING' | 'WAITING_FOR_OPPONENT';

export default function LobbyPage() {
  const secondRender = useRef(false);
  const [inQueue, setInQueue] = useState(false);
  const [showAlreadyConnectedDialog, setShowAlreadyConnectedDialog] =
    useState(false);
  const navigate = useNavigate();
  const [queueState, setQueueState] = useState<QueueState>('DISCONNECTED');
  const { triggerLogin } = useAuth();

  const joinQueue = async () => {
    setInQueue(true);
    setQueueState('WAITING_FOR_OPPONENT');
    socket.emit('ENTER_QUEUE');
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

  const onConnectionError = useCallback((err: Error) => {
    if (err.message === 'Invalid or missing token') triggerLogin();
    else if (err.message === 'User is already connected')
      setShowAlreadyConnectedDialog(true);
    else console.error(err);
  }, []);

  const onConnect = useCallback(() => {
    setShowAlreadyConnectedDialog(false);
  }, []);

  useEffect(() => {
    if (secondRender.current) return; // prevent second render with strict mode
    secondRender.current = true;
    socket.on('GAME_FOUND', onGameFound);
    socket.on('ACCEPTED_INVITATION', onInvitationAccepted);
    socket.on('connect_error', onConnectionError);
    socket.on('connect', onConnect);

    socket.on('disconnect', () => console.log('disconnect'));
    if (!socket.connected) socket.connect();
    return () => {
    };
  }, []);

  return (
    <>
      <PageLobby></PageLobby>
    </>
  );
}
