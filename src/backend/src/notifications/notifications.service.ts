import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/entities/notification.entity';
import Notification from 'src/entities/notification.entity';
import User from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { ChatMessageDTO } from 'src/types/ChatMessage.dto';

interface NotificationBase {
  id: number;
  date: Date;
  user: User;
  type: NotificationType;
}

export type NotificationFriendRequestReceivedContent = {
  friend: {
    id: number;
    username: string;
  };
};

export type NotificationFriendRequestAcceptedContent = {
  friend: {
    id: number;
    username: string;
  };
};

export type NotificationFriendRequestRejectedContent = {
  friend: {
    id: number;
    username: string;
  };
};

export type NotificationGameInvitationReceivedContent = {
  friend: {
    id: number;
    username: string;
  };
  lobby: {
    id: number;
  };
};

export type NotificationNewAchievementContent = {
  achievement: string;
};

export type NotificationNewMessageContent = {
  message: {
    id: number;
    room: { id: string; name: string };
    text: string;
    sentAt: Date;
    from: { username: string };
  };
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private readonly notificationGateway: NotificationsGateway,
  ) {}

  async notify(user: User, type: NotificationType.FriendRequestReceived, content: NotificationFriendRequestReceivedContent): Promise<void>; // prettier-ignore
  async notify(user: User, type: NotificationType.FriendRequestAccepted, content: NotificationFriendRequestAcceptedContent): Promise<void>; // prettier-ignore
  async notify(user: User, type: NotificationType.NewMessage, content: NotificationNewMessageContent): Promise<void>; // prettier-ignore
  async notify(user: User, type: NotificationType.GameInvitationReceived, content: NotificationGameInvitationReceivedContent): Promise<void>; // prettier-ignore
  async notify(user: User, type: NotificationType.NewAchievement, content: NotificationNewAchievementContent): Promise<void>; // prettier-ignore
  //   async notify(user: User,type: NotificationType, content: NotificationFriendRequestReceivedContent | NotificationFriendRequestAcceptedContent | NotificationNewMessageContent): Promise<void> // prettier-ignore
  async notify(
    user: User,
    type: NotificationType,
    content:
      | NotificationFriendRequestReceivedContent
      | NotificationFriendRequestAcceptedContent
      | NotificationNewMessageContent
      | NotificationGameInvitationReceivedContent
      | NotificationNewAchievementContent,
  ) {
    const newNotification = this.notificationRepository.create({
      user,
      type,
      content: JSON.stringify(content),
      date: new Date(),
    });
    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );
    await this.notificationGateway.sendToUser(user.id, savedNotification);
  }

  async getNotifications(user: User) {
    const notifications = await this.notificationRepository.find({
      where: { user: user },
      order: { id: { direction: 'DESC' } },
    });
    return notifications.map((notif) => ({
      ...notif,
      content: JSON.parse(notif.content),
    }));
  }

  async markRead(notificationIds: number[]) {
    await this.notificationRepository.update(
      { id: In(notificationIds) },
      { isRead: true },
    );
  }
}
