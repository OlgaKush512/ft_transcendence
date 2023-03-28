import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { Room } from '../routes/Chat/types';
import Avatar from '@mui/material/Avatar';
import astro from '../assets/img/astro.png';
import rocket from '../assets/img/rocket.png';

export type BasicListProps = {
  rooms: (Room & { selected: boolean })[];
};

export default function BasicList(props: BasicListProps) {
  const navigate = useNavigate();
  const text = {
    color: 'grey',
    fontSize: 15,
  };

  return (
    // <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", flexGrow: 1, overflow: "auto" }}>
    <nav aria-label="list of rooms">
      <List disablePadding>
        {props.rooms.map((room, i) => (
          <ListItem
            disablePadding
            onClick={() => navigate(`/app/chat?id=${room.id}`)}
            key={`item-${i}`}
            selected={room.selected}
          >
            <ListItemButton>
              <Avatar
                alt={room.name}
                src={
                  (room as any).type === 'private'
                    ? (room as any).imageUrl
                    : rocket
                }
                sx={{ width: 37, height: 37, m: 1 }}
              />
              <ListItemText primary={room.name} style={{minWidth: 'unset'}}/>
              <ListItemText
                primaryTypographyProps={{ style: text }}
                primary={room.lastMessage?.text}
              />
              {room.unreadMessages ? (
                <div className="unread-badge">{room.unreadMessages}</div>
              ) : undefined}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </nav>
    // </Box>
  );
}
