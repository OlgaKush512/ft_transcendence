import { Box, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import flyingBirds from '../video/flyingBirds1.mp4';
import TheMusic from '../music/StartPageMusic.mp3';

const LandingPage = () => {
  const navigate = useNavigate();

  const play = () => {
    new Audio(TheMusic).play();
  };
  return (
    <div>
      <MainLayout />
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          left: '50%',
          top: '50%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: '-1',
          opacity: '0.1',
        }}
      >
        <source src={flyingBirds} type="video/mp4" />
      </video>
      {/* <audio controls autoPlay src={TheMusic}>
        <source src={TheMusic} type="audio/mpeg" />
      </audio> */}
      <Box
        onPlaying={play}
        sx={{
          textAlign: 'center',
          marginTop: '50vh',
        }}
      >
        <NavLink to="/app" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button
            variant="contained"
            sx={{ fontSize: '30px', opacity: '0.9' }}
            onClick={() => navigate('/app')}
          >
            Start playing!
          </Button>
        </NavLink>
      </Box>
    </div>
  );
};

export default LandingPage;
