import React, { useEffect, useState } from 'react';
import { myApi } from '../tools/apiHandler';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAxiosError } from '../tools/apiHandler';
import { useAuth } from '../tools/auth';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import OtpInput from '../components/OtpInput';

const TwoFactorAuthVerificationPage = () => {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const { signIn, is2FAPending, isBlocked, setAuthState } = useAuth();

  useEffect(() => {
    if (code.length === 4) {
      setCode('');
      sendCode();
    }
  }, [code]);

  if (isBlocked()) return <Navigate to="/account-blocked" />;

  if (!is2FAPending()) return <Navigate to="/login" />;

  const onCodeChange = (val: string) => {
    setCode(val);
  };

  const sendCode = async () => {
    try {
      const response = await myApi.twoFactorAuthControllerVerify({
        code: code,
      });
      if (response.data.status === 'ok') {
        const data = await myApi.usersControllerGetProfile();
        signIn(data.data);
      } else if (response.data.error === 'Account Blocked') {
        setAuthState('BLOCKED');
        navigate('/account-blocked');
      } else if (response.data.error === 'Code Expired') {
        setError(<p>Code Expired</p>);
      } else if (response.data.error === 'Invalid Code') {
        setError(<p>Invalid Code</p>);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        // console.log('response', error, error.response?.status);
        if (error.response?.status === 401) {
          setError('invalid code');
        }
      }
    }
  };

  const resend = async () => {
    const response = await myApi.twoFactorAuthControllerResendCode();
  };

  return (
    <Dialog
      open={true}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        textAlign="center"
        id="alert-dialog-title"
        fontSize={30}
        fontWeight="300"
      >
        {'Two-Factor Authentication'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          textAlign="center"
          id="alert-dialog-description"
          fontSize={20}
          fontWeight="300"
        >
          Enter the 4 digits sent to your e-mail
        </DialogContentText>
        <OtpInput value={code} valueLength={4} onChange={onCodeChange} />
        {/* <p style={{ color: 'red' }}>{isCodeInvalid ? 'invalid code' : ''}</p> */}
        <div
          style={{
            height: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#994a2e',
          }}
        >
          {error ? error : ''}
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mb: '15px' }}>
        <Button
          variant="outlined"
          size="large"
          style={{ margin: 'auto' }}
          onClick={resend}
        >
          Resend code
        </Button>
      </DialogActions>
    </Dialog>
    // <div>
    //   <h3>TwoFactorAuthVerificationPage</h3>
    //   <input
    //     type="text"
    //     value={code || ''}
    //     onChange={onCodeChange}
    //     onKeyPress={onKeyPress}
    //   />
    //   <button onClick={sendCode}>authenticate</button>
    //   <button onClick={resend}>resend code</button>
    //   <br />
    //   <p style={{ color: 'red' }}>{isCodeInvalid ? 'invalid code' : ''}</p>
    // </div>
  );
};

export default TwoFactorAuthVerificationPage;
