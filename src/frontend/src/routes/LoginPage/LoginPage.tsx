import { Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAuth } from '../../tools/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';

const LoginPage = () => {
  const { isAuthenticated, is2FAPending } = useAuth();
  const location = useLocation();
  const [hover, setHover] = useState(false);

  useEffect(() => {
  }, []);
  if (isAuthenticated()) return <Navigate to="/app" />;
  if (is2FAPending()) return <Navigate to="/authenticate" />;

  return (
    <div className="container">
      <Paper elevation={2} className="card">
        <Logo />
        <a
          href={'http://localhost:5000/api/auth/42/login'}
          className="link"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <FontAwesomeIcon icon={hover ? faUnlock : faLock} size={'5x'} />
          <br />
          <br />
          <Typography variant="h4">Sign in with 42</Typography>
        </a>
      </Paper>
    </div>
  );
};

export default LoginPage;
