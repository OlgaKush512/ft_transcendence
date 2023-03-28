import { ApiProperty } from '@nestjs/swagger';
import { NotificationDTO } from './NotificationResponse.dto';

export class GetNotificationsResponseDTO {
  @ApiProperty({})
  notifications: NotificationDTO[];
}
