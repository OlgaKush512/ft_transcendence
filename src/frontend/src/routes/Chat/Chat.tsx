import { useContext, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import ScrollToBottom from 'react-scroll-to-bottom';
import Default from './Default';
import { chatContext } from './Layout';
import { myApi } from '../../tools/apiHandler';
import { deserializeMessage, Message, Serialized } from './types';
import './Chat.css';
import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';

import MemberContextMenu, { ContextMenuData } from './MemberContextMenu';
import { useChatSocket } from '../../layouts/MainLayout';

export type SocketMessage = {
  room: string;
  message: string;
};
// Format the sentAt property which is a Date object to a string in hh:mm format
const formatHours = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
};

type MutedDialogData = {
  open: boolean;
  by: string;
  for: string;
};

function Chat() {
  // The text being typed into the textfield
  const [currentMessage, setCurrentMessage] = useState('');
  // The page of messages to be fetched on the next query from the server
  const [nextPage, setNextPage] = useState(2);
  // Array of messages rendered on screen
  const [messages, setMessages] = useState<Message[]>([]); //List of messages coming into the chat
  // Username of the logged in user, used to differentiate its messages from others
  const [username, setUsername] = useState('');
  // Determines wether to show the 'load more messages' button or not
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  const idRef = useRef<string | null>(null);
  const theTheme = useTheme();

  const socket = useChatSocket().socket;
  // Store the room Id extracted from the URL query param in the parent component
  const { roomId, updateRoom, roomData } = useContext(chatContext);
  const [role, setRole] = useState<'admin' | 'owner' | 'member'>('admin');
  const [isMuted, setMute] = useState(false);

  // Add a context menu on right-click on messages
  const [contextMenuData, setContextMenuData] =
    useState<ContextMenuData | null>(null);

  const [mutedDialogData, setMutedDialogData] = useState<MutedDialogData>({
    by: '',
    for: '',
    open: false,
  });

  const handleContextMenu = (event: React.MouseEvent, message: Message) => {
    event.preventDefault();
    setContextMenuData({
      pos: { x: event.clientX + 2, y: event.clientY - 6 },
      otherUsername: message.from,
    });
  };

  const handleClose = () => {
    setContextMenuData(null);
  };

  // Set the current state when the data has been loaded
  useEffect(() => {
    if (!roomData) return;
    // Add the messages we got from the server into the list of messages to be rendered, making sure that we deserialize the sentAt property back to a Date object.
    setMessages((curr) => {
      if (roomData.id === idRef.current) return curr;
      idRef.current = roomData.id;
      return roomData.messages.map((msg) => deserializeMessage(msg));
    });
    // Keep the username of the user to differentiate its messages from others
    setUsername(roomData.username);
    // Check whether there are more messages to be fetched so that we can show the 'load more messages' button if needed
    setHasMoreMessages(roomData.hasMoreMessages);
    setRole(roomData.role);
    if (
      roomData.users.find((user) => user.username === roomData.username)?.muted
    )
      setMute(true);
    else setMute(false);
  }, [roomData]);

  // Send a message in the conversation
  const sendMessage = () => {
    if (!currentMessage.length) return;

    const message: Message = {
      from: username,
      text: currentMessage,
      sentAt: new Date(),
      id: 0,
    };

    socket.emit('send_message', {
      message: currentMessage,
      room: roomId,
    } as SocketMessage);
    setMessages((list) => [...list, message]); // receive a message also when we emit it
    setCurrentMessage('');
    updateRoom(roomId!, { lastMessage: message }); // Update the last messages displayed in the rooms list
  };

  // Get more previous messages from the server
  const loadMoreMessages = async () => {
    if (!messages[0]) return;
    const response = await myApi.chatControllerGetMessages({
      roomId: roomId!,
      page: messages[0].id,
    });
    setMessages((list) => [
      ...response.data.messages.map((msg) => deserializeMessage(msg)),
      ...list,
    ]);
    setHasMoreMessages(response.data.hasMore);
    setNextPage(nextPage + 1);
  };

  const onReceiveMessageListener = (data: Serialized<Message>) => {
    // We make sure to deserialize the sentAt property back to a Date object
    const message = deserializeMessage(data);
    if (message.room !== roomId) return;
    setMessages((list) => [...list, message]); //when we receive a message, it is equal to whatever list it was before, with the new message added at the end
  };

  const onMemberMutedListener = (data: any) => {
    if (data.username === username && data.roomId === roomData?.id) {
      setMutedDialogData({
        by: data.by,
        for: data.for,
        open: true,
      });
    }
  };

  const onMemberUnmutedListener = (data: any) => {
    if (data.username === username) setMute(false);
  };

  // Tell the server that we've seen all the messages either when we load the conversation, or when we receive a message via socket
  useEffect(() => {
    if (!messages.length) return;
    socket.emit('seen_message', roomId);
  }, [messages]);

  // Triggered when we change rooms
  useEffect(() => {
    if (!roomId) return;
    socket.on('receive_message', onReceiveMessageListener);
    socket.on('mute', onMemberMutedListener);
    socket.on('unmute', onMemberUnmutedListener);
    return () => {
      // We pass in the listener function to the .off() method to only remove this listener. Otherwise, the listener located in the <Layout> component get removed as well !
      socket.off('receive_message', onReceiveMessageListener);
      socket.off('mute', onMemberMutedListener);
      socket.off('unmute', onMemberUnmutedListener);
    };
  }, [socket, roomId, username]);

  // Show a default page if no room is selected
  if (!roomId) return <Default />;

  return (
    <>
      <div
        className="chat-body"
        style={{ backgroundColor: theTheme.palette.background.paper }}
      >
        <ScrollToBottom className="message-container">
          {hasMoreMessages && (
            <div className="more-msg-wrapper">
              <button className="more-msg-btn" onClick={loadMoreMessages}>
                Load more messages
              </button>
            </div>
          )}
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
          {messages.map((messageContent: Message, index: number) => {
            return (
              <div
                className="message"
                id={username === messageContent.from ? 'other' : 'you'}
                key={index}
              >
                <div
                  onClick={
                    messageContent.from !== username
                      ? (e) => handleContextMenu(e, messageContent)
                      : undefined
                  }
                  style={{
                    cursor:
                      messageContent.from !== username ? 'pointer' : undefined,
                  }}
                >
                  <div className="message-content">
                    <p>{messageContent.text}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{formatHours(messageContent.sentAt)}</p>
                    <p id="author">{messageContent.from}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div
        className="chat-footer"
        style={{ backgroundColor: theTheme.palette.background.paper }}
      >
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          disabled={isMuted === true}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            size="medium"
            onClick={sendMessage}
          >
            Send
          </Button>
        </Stack>
      </div>
      <Dialog
        open={mutedDialogData.open}
        onClose={() => {
          setMutedDialogData((curr) => ({ ...curr, open: false }));
        }}
      >
        <DialogTitle>You have been muted</DialogTitle>
        <DialogContent>
          You have been muted by <strong>{mutedDialogData?.by}</strong> for{' '}
          <strong>
            {mutedDialogData?.for === '30s'
              ? '30 seconds'
              : mutedDialogData?.for === '5m'
              ? '5 minutes'
              : '1 hour'}
          </strong>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMutedDialogData((curr) => ({ ...curr, open: false }));
            }}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Chat;
