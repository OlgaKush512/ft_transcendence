import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { isAxiosError, myApi } from "../../tools/apiHandler";
import { chatContext } from "./Layout";
import { deserializeMessage } from "./types";
import gravity from "../../assets/img/gravityNew.gif";
import { Box, Paper, Stack, useTheme } from "@mui/material";

function SearchRoom({ socket, username }: any) {
  const [password, setPassword] = useState("");
  const [roomID, setRoomID] = useState("");
  const { rooms, setRooms } = useContext(chatContext);
  const [roomExists, setRoomExists] = useState(true);
  const [passwordIssue, setPasswordIssue] = useState(false);
  const theTheme = useTheme();

  const navigate = useNavigate();

  const onJoinRoom = async () => {
    if (roomID === "") return;
    try {
      const response = await myApi.chatControllerJoinRoom({
        roomName: roomID,
        password: password,
      });
      // console.log(response.status);
      setRooms([
        ...rooms,
        {
          ...response.data.room,
          lastMessage: deserializeMessage(response.data.room.lastMessage),
        },
      ]);
      navigate(`/app/chat?id=${response.data.room.id}`);
    }
    catch (e) {
      // console.log(e);
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          setPasswordIssue(true);
          setRoomExists(true);      
        }
        else {
          setRoomExists(false);
          setPasswordIssue(false);
        }
      }
    }
  };

  return (    
    <div className="SearchRoom" style={{ backgroundColor: theTheme.palette.background.paper }}>
      <img src={gravity} alt="my-gif" />
      <input
        type="text"
        placeholder="Enter a room ID..."
        onChange={(event) => {
          setRoomID(event.target.value);
        }}
      />
      <div>
        {(!roomExists || passwordIssue)
        ? <p style={{ color: 'red' }}>{passwordIssue ? 'Password is incorrect' : 'Room does not exist'}</p>
        : undefined
        }
      </div>
      <input
        type="password" // <== hides characters :D
        placeholder="Enter the password..."
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Button onClick={onJoinRoom}>Join Room</Button>
    </div>
  );
}

export default SearchRoom;