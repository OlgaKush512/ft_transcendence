import { MenuItem, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC, memo } from 'react';

dayjs.extend(relativeTime);

export type NotificationMenuItemProps = {
  title: string;
  date: Date | string;
  children: React.ReactNode;
  id: number;
  isRead: boolean;
};

export const NotificationMenuItem: FC<NotificationMenuItemProps> = memo(
  (props) => {
    const theTheme = useTheme();
    return (
      <MenuItem disableRipple={true} key={props.id} disableGutters>
        <div
          className={`notif-container ${props.isRead ? '' : 'notif-unread'}`}
          style={{ backgroundColor: theTheme.palette.background.paper }}
        >
          <div className="notif-header">
            <div className="notif-title">{props.title}</div>
            <div className="notif-date">
              {dayjs(new Date(props.date)).fromNow()}
            </div>
          </div>
          {props.children}
        </div>
      </MenuItem>
    );
  },
);
