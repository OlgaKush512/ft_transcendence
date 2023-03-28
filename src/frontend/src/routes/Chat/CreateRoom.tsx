import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import RadioButton from '../../components/RadioButton';
import { useNavigate } from 'react-router-dom';
import { myApi } from '../../tools/apiHandler';
import { chatContext } from './Layout';
import { deserializeMessage, RoomType } from './types';
import astrobibou from '../../assets/img/astrobibou.gif';
import { useTheme } from '@mui/material/styles';

function CreateRoom({ socket, username }: any) {
  const [password, setPassword] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('public');
  const [roomID, setRoomID] = useState('');
  const { rooms, setRooms } = useContext(chatContext);
  const [passwordIssue, setPasswordIssue] = useState(false);
  const [roomExists, setRoomExists] = useState(false);
  const theTheme = useTheme();

  const navigate = useNavigate();

  const onCreateRoom = async () => {
    try {
      const response = await myApi.chatControllerCreateRoom({
        name: roomID,
        type: roomType,
        password: roomType === 'protected' ? password : undefined,
      });
      setRooms([
        ...rooms,
        {
          ...response.data.room,
          lastMessage: deserializeMessage(response.data.room.lastMessage),
        },
      ]);
      navigate(`/app/chat?id=${response.data.room.id}`);
    }
    catch(e) {
      // console.log(e);
      if (roomType === 'protected' && password === '') {
        setPasswordIssue(true);
        setRoomExists(false);
      }
      else {
        setRoomExists(true);
        setPasswordIssue(false);
      }
    }

  };

  return (
    <div className="CreateRoom" style={{ backgroundColor: theTheme.palette.background.paper }}>
      <img src={astrobibou} alt="my-gif" />
      <RadioButton value={roomType} onChange={setRoomType} />
      <input
        type="text"
        placeholder="Enter your room name..."
        onChange={(event) => {
          setRoomID(event.target.value);
        }}
      />
      <div>
        {(roomExists|| passwordIssue )
        ? <p style={{ color: 'red' }}>{passwordIssue ? 'Please enter a password' : 'Room already exists'}</p>
        : undefined
        }
      </div>
      <input
        disabled={roomType !== 'protected'}
        type="text"
        placeholder="Enter a password..."
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Button onClick={onCreateRoom}>Create Room</Button>
    </div>
  );
}

export default CreateRoom;
