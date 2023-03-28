import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import OtpInput from './OtpInput';

const Page2FA = () => {
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [otp, setOtp] = useState('');
  const onChange = (value: string) => setOtp(value);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <OtpInput value={otp} valueLength={4} onChange={onChange} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: '15px' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            sx={{ width: '40%' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            autoFocus
            variant="contained"
            size="large"
            sx={{ width: '40%' }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page2FA;
