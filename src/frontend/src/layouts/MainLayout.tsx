import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { io } from 'socket.io-client';
import { useEffect, useState, createContext, useContext } from 'react';

const chatSocket = io('localhost:5000/chat', {
  withCredentials: true, // Needed to authenticate the user with cookies
  autoConnect: false, // Needed so that we wait for this page to be rendered before connecting to the server
});

const chatSocketContext = createContext({socket: chatSocket})
export const useChatSocket = () => useContext(chatSocketContext);

const MainLayout = (props: any) => {
  const { mode, setMode } = props;


  useEffect(() => {
    chatSocket.connect()
    return () => {
      chatSocket.disconnect();
    }
  }, [])

  return (
    <>
      <chatSocketContext.Provider value={{socket: chatSocket}}>
      <NavBar mode={mode} setMode={setMode} />
      <Outlet />
      </chatSocketContext.Provider>
    </>
  );
};

export default MainLayout;
