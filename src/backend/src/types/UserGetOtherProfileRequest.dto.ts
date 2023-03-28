import { IsNotEmpty, IsString } from 'class-validator';

export class UserGetOtherProfileRequestDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}
