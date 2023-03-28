import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { GetNotificationsResponseDTO } from 'src/types/NotificationsGetNotificationsResponse.dto';
import { NotificationType } from 'src/entities/notification.entity';
import { MarkReadRequestDTO } from 'src/types/NotificationsMarkReadRequest.dto';

@Controller('/api/notifications')
export class NotificationsController {
  constructor(
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('')
  async getNotifications(
    @Req() req: Request,
  ): Promise<GetNotificationsResponseDTO> {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    return {
      notifications: await this.notificationsService.getNotifications(user),
    };
  }

  @Post('read')
  async markRead(@Req() req: Request, @Body() body: MarkReadRequestDTO) {
    this.notificationsService.markRead(body.ids);
    return;
  }
}
