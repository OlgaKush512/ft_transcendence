import User from '../entities/user.entity';
import { FriendData } from './UserFriendData.dto';

export class GetHomeDataResponseDTO {
  isInitialized: boolean;
  online: FriendData[];
  friends: FriendData[];
  inGame: FriendData[];
  stats: any[];
  merged: any;
}
