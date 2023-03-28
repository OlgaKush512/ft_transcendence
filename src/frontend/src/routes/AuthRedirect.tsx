import axios from 'axios';
import React, { useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { myApi } from '../tools/apiHandler';
import { useAuth } from '../tools/auth';

const AuthRedirect = () => {
  const { setAuthState, signIn, triggerLogin } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    try {
      axios.get('/api/auth/2fa/status').then((response) => {
        if (response.data.status === 'Uninitialized') {
          setAuthState('UNINITIALIZED');
          navigate('/new-user', { state: { state: 'UNINITIALIZED' } });
        } else if (response.data.status === 'Authorized') {
          myApi.usersControllerGetProfile().then((data) => {
            signIn(data.data);
          });
        } else if (response.data.status === 'Pending') {
          setAuthState('TFA_PENDING');
          navigate('/authenticate', { state: { state: 'TFA_PENDING' } });
        } else if (response.data.status === 'Blocked') {
          setAuthState('BLOCKED');
          navigate('/account-blocked', { state: { state: 'BLOCKED' } });
        }
      });
    } catch {
      triggerLogin();
    }
  }, []);

  return <></>;
};

export default AuthRedirect;
