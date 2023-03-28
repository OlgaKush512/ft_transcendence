import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import './index.css';
import { io } from 'socket.io-client';
import { ProtectedRoute } from './tools/auth';
import { Snackbar } from '@mui/material';
import AuthProviderLayout from './layouts/AuthProviderLayout';
import ClientProviderLayout from './layouts/ClientProviderLayout';
import AuthRedirect from './routes/AuthRedirect';
import ErrorBoundary from './routes/ErrorBoundary';
import LandingPage from './routes/LandingPage';
import AccountBlocked from './routes/AccountBlocked';
import LoginPage from './routes/LoginPage';
import TwoFactorAuthVerificationPage from './routes/TwoFactorAuthVerificationPage';
import HomePage from './routes/HomePage';
import Profile from './routes/Profile';
import Friends from './routes/Friends';
import PublicProfile from './routes/PublicProfile';
import Game from './routes/GamePage/game';
import MainLayout from './layouts/MainLayout';
import GodModePage from './routes/GodModePage';
import Layout from './routes/Chat/Layout';
import Chat from './routes/Chat/Chat';
import SearchRoom from './routes/Chat/Search';
import CreateRoom from './routes/Chat/CreateRoom';
import NewUser from './routes/NewUser';
import React from 'react';
import LobbyPage from './routes/GamePage/starter';
// import StarterPage from './routes/GamePage/starter';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme, darkTheme } from './mainTheme';
import { Palette } from '@mui/icons-material';
import WatchPage from './routes/GamePage/WatchPage';
import GamePage from './routes/GamePage/GamePage';
import Members from './routes/Chat/Members';
import PageTeam from './routes/PageTeam';
import Page404 from './routes/Page404';
import UnexpectedError from './routes/UnexpectedError';
import PageLobby from './components/PageLobby';
import { ToastContainer } from 'react-toastify';
import WatchTheGame from './components/WatchTheGame';

// const socket = io('localhost:5000/notifications', {
//   withCredentials: true,
//   autoConnect: false,
// });

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark' | undefined>('light');

  const getDesignTokens = (mode: 'light' | 'dark' | undefined) =>
    mode === 'light' ? theme : darkTheme;

  const theTheme = createTheme(getDesignTokens(mode));

  
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AuthProviderLayout />}>
        <Route element={<ClientProviderLayout />}>
          <Route path="/" errorElement={<ErrorBoundary />}>
            <Route index element={<LandingPage />} />
            <Route path="account-blocked" element={<AccountBlocked />} />
            <Route path="redirect" element={<AuthRedirect />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="godmode" element={<GodModePage />} />
            <Route path="team" element={<PageTeam />} />
            <Route
              path="authenticate"
              element={<TwoFactorAuthVerificationPage />}
            />
            <Route path="new-user" element={<NewUser />} />
            <Route path="app" element={<ProtectedRoute />}>
              <Route element={<MainLayout mode={mode} setMode={setMode} />}>
                <Route index={true} element={<HomePage />} />
                <Route path="profile/" element={<Profile mode={mode} />} />
                <Route path="game" element={<PageLobby />} />
                <Route path="game/end/:winner" element={<PageLobby />} />
                <Route path="game/:id" element={<GamePage />} />
                <Route path="watch/:id" element={<WatchPage />} />
                <Route path="live" element={<WatchTheGame />} />
                <Route
                  path="users/:username"
                  element={<PublicProfile mode={mode} />}
                />
                <Route path="friends/" element={<Friends />} />
                <Route path="test" element={<div>test</div>} />
                <Route path="chat" element={<Layout />}>
                  <Route index element={<Chat />} />
                  <Route path="search" element={<SearchRoom />} />
                  <Route path="create" element={<CreateRoom />} />
                  <Route path="members" element={<Members />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>,
    ),
    {},
  );

  function delBefore() {
    const el = document.body;
    if (el !== null) {
      el.className = 'new';
    }
  }

  function delNew() {
    const el = document.body;
    if (el !== null) {
      el.className = 'old';
    }
  }

  useEffect(() => {
    if (mode === 'dark') {
      delBefore();
    } else if (mode === 'light') {
      delNew();
    }
  }, [mode]);

  return (
    <>
      <ThemeProvider theme={theTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer />
      </ThemeProvider>
    </>
  );
};

export default App;
