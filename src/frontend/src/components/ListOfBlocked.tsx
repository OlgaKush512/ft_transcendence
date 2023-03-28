import {
  Box,
  Avatar,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Divider,
} from '@mui/material';
import { users, user } from '../data/data';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { myApi } from '../tools/apiHandler';

export function usersFilteredByBlocked(users: user[]) {
  const theUsers = [...users];

  const theBlocked = theUsers.filter((person) => person.isBlocked);

  return theBlocked;
}

const Blocked = (props: any) => {
  const { person } = props;

  const onUnblock = async () => {
    const response = await myApi.usersControllerUnblock(
      {
        username: person.username,
      },
      { toastError: true } as any,
    );
    if (props.refetch) props.refetch();
  };

  return (
    <>
      <Grid container columns={8} alignItems="center">
        <Grid item xs={3}>
          <Box display="inline-flex" alignItems="center">
            <Link
              to={'/app/users/' + person.username}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Avatar
                sx={{ width: 35, height: 35, m: 1 }}
                src={person.imageUrl}
              ></Avatar>
            </Link>
            <Link
              to={'/app/users/' + person.username}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography>{person.username}</Typography>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={5} display="flex" justifyContent="flex-end">
          <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
            <Button onClick={onUnblock}>unblock</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
};

const ListOfBlocked = (props: any) => {
  useEffect(() => {
    if (!props.data) return;
    
  }, [props.data]);
  if (!props.data) return <></>;

  return (
    <>
      {props.data.blocked.map((person: any, index: number) => (
        <div key={`blocked-${index}`}>
          <Blocked person={person} refetch={props.refetch} />
          {index !== props.data.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
};

export default ListOfBlocked;
