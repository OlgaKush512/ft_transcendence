import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PersonToInvite = (props: any) => {
  const { person, isLast, invited, onButtonClick, disabled, rejected } = props;

  return (
    <>
      <Grid container columns={8} alignItems="center">
        <Grid item xs={2}>
          <Box
            flex={5}
            display="flex"
            alignItems="center"
            justifyContent="left"
          >
            <Avatar
              sx={{ width: 35, height: 35, m: 1 }}
              src={person.imageUrl}
            ></Avatar>

            <Typography>{person.username}</Typography>
            {person.status.includes('friend') && (
              <Chip
                label="Friend"
                variant="outlined"
                size="small"
                style={{ marginInline: 10 }}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={3} justifyContent="center"></Grid>
        <Grid item xs={3}>
          <Stack direction="row" spacing={1} justifyContent="right" mr={1}>
            {rejected ? (
              <Button
                variant="outlined"
                sx={{ whiteSpace: 'nowrap' }}
                disabled
                style={{ color: '#9a6350', borderColor: '#9a6350' }}
              >
                Rejected
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{ whiteSpace: 'nowrap' }}
                onClick={onButtonClick}
                disabled={disabled}
              >
                {invited ? 'Cancel' : "Let's Play!"}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
      {!isLast && <Divider />}
    </>
  );
};

export default PersonToInvite;
