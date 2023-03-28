import { useContext, useEffect, useState } from 'react';
import { chatContext } from './Layout';
import { Avatar, Button } from '@mui/material';
import MemberContextMenu, { ContextMenuData } from './MemberContextMenu';
import { useNavigate } from 'react-router-dom';
import { isAxiosError, myApi } from '../../tools/apiHandler';
import { useTheme } from '@mui/material/styles';

const Members = () => {
  const { roomData } = useContext(chatContext);
  const [contextMenuData, setContextMenuData] =
    useState<ContextMenuData | null>(null);
  const [role, setRole] = useState<'owner' | 'admin' | 'member'>('member');
  const [username, setUsername] = useState('');
  const [roomID, setRoomID] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordIssue, setPasswordIssue] = useState(false);
  const [write, setWrite] = useState(false);
  const theTheme = useTheme();

  const navigate = useNavigate();

  const onChangePassword = async () => {
    if (roomID === "") return;
    try {
      const response = await myApi.chatControllerChangePassword({
        roomId: roomID,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      // console.log(response.status);
      setWrite(true);
      setPasswordIssue(false);
    }
    catch (e) {
      // console.log(e);
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          setPasswordIssue(true);
          setWrite(false);
        }
      }
    }
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    otherUsername: string,
  ) => {
    event.preventDefault();
    setContextMenuData({
      pos: { x: event.clientX + 2, y: event.clientY - 6 },
      otherUsername: otherUsername,
    });
  };

  const handleClose = () => {
    setContextMenuData(null);
  };

  useEffect(() => {
  }, [roomData]);

  useEffect(() => {
    if (!roomData) return;
    setRole(roomData?.role);
    setUsername(roomData.username);
    setRoomID(roomData.id);
  }, [roomData]);

  if (!roomData) return <div className="room-members"></div>;

  return (
    <div className="room-members" style={{ backgroundColor: theTheme.palette.background.paper }}>
      <h3>Members</h3>
      {roomData?.users.map((member) => (
        <div
          key={member.id}
          className={`member-item-container ${
            member.username === username ? 'me' : ''
          }`}
          onClick={
            member.username !== username
              ? (e) => {
                  handleContextMenu(e, member.username);
                }
              : undefined
          }
          style={{
            cursor: member.username !== username ? 'pointer' : undefined,
          }}
        >
          <Avatar src={member.imageUrl} />
          <div className="member-item-username">{member.username}</div>
          {roomData.type !== 'private' && (
            <div className="member-item-role">{member.role}</div>
          )}
          {member.inGame && 'IN GAME' 
          ? <Button
            variant="contained"
            size="small"
            onClick={ () => navigate(`/app/watch/${member.gameId}`) } 
          >
            Watch Game
          </Button>
          : undefined}
          <div className="member-item-spacer" />
          </div>
      ))}
      {roomData?.type !== 'private' && <h3>Banned</h3>}
      {roomData?.type !== 'private' &&
        roomData?.banned.map((member) => (
          <div
            key={(member as any).id}
            className="member-item-container"
            onClick={
              (member as any).username !== username
                ? (e) => {
                    handleContextMenu(e, (member as any).username);
                  }
                : undefined
            }
            style={{
              cursor:
                (member as any).username !== username ? 'pointer' : undefined,
            }}
          >
            <Avatar src={(member as any).imageUrl} />
            <div className="member-item-username">
              {(member as any).username}
            </div>
            <div className="member-item-spacer" />
          </div>
        ))}
      {contextMenuData !== null && (
        <MemberContextMenu
          onClose={handleClose}
          otherUsername={contextMenuData?.otherUsername}
          pos={contextMenuData?.pos!}
          role={role}
          username={username}
          roomType={roomData?.type!}
          />
          )}
      {roomData?.type === 'protected' && (role === 'owner') && <h3>Change Password</h3>}
      {roomData?.type === 'protected' && (role === 'owner') &&
      <div>
      <input
        type="text"
        placeholder="Enter your current password..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
        />
      <div>
        {(passwordIssue)
        ? <p style={{ color: 'red' }}>Password is incorrect</p>
        : undefined
        }
      </div>
      <input
        type="text"
        placeholder="Enter your new password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
        />
      <Button onClick={onChangePassword}>Change password</Button>
      <div>
        {(write)
        ? <p style={{ color: 'red' }}>Password was successfully changed !</p>
        : undefined
        }
      </div>
      </div>
      }
    </div>
  );
};

export default Members;
