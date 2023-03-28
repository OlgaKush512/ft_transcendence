import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ChatRoomData } from './ChatRoomData.dto';

export class GetRoomsResponseDTO {
  rooms: ChatRoomData[];
}
