import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginFakeUserRequestDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  login: string;
}
