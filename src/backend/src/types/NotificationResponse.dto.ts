import { ApiProperty, getSchemaPath, refs } from '@nestjs/swagger';
import Notification, {
  NotificationType,
} from 'src/entities/notification.entity';
import {
  NotificationFriendRequestAcceptedContent,
  NotificationFriendRequestReceivedContent,
  NotificationFriendRequestRejectedContent,
} from 'src/notifications/notifications.service';

// export class NotificationFriendRequestReceivedDTO extends NotificationBaseDTO {
//   type: NotificationType.FriendRequestReceived;
//   content: NotificationFriendRequestReceivedContentDTO;
// }

export class NotificationFriendRequestReceivedContentDTO
  implements NotificationFriendRequestReceivedContent
{
  friend: { id: number; username: string };
}

// export class NotificationFriendRequestAcceptedDTO extends NotificationBaseDTO {
//   type: NotificationType.FriendRequestAccepted;
//   content: NotificationFriendRequestAcceptedContentDTO;
// }

export class NotificationFriendRequestAcceptedContentDTO
  implements NotificationFriendRequestAcceptedContent
{
  friend: { id: number; username: string };
}

// export class NotificationFriendRequestRejectedDTO extends NotificationBaseDTO {
//   type: NotificationType.FriendRequestAccepted;
//   content: NotificationFriendRequestRejectedContentDTO;
// }

export class NotificationFriendRequestRejectedContentDTO {
  //   implements NotificationFriendRequestRejectedContent
  friend: { test: number };
}

export class NotificationDTO {
  id: number;
  @ApiProperty({ type: 'enum', enum: NotificationType })
  type: NotificationType;
  date: Date;
  isRead: boolean;
  content: NotificationFriendRequestReceivedContentDTO;
}

export class NotificationDTOTest {
  id: number;
  @ApiProperty({ type: 'enum', enum: NotificationType })
  type: NotificationType;
  date: Date;
  isRead: boolean;
  content: NotificationFriendRequestRejectedContentDTO;
}
