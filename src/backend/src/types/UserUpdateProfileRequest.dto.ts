import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
import User from "src/entities/user.entity";

export class UserUpdateProfileRequestDTO {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9_]*$/)
  username?: string;

  isTwoFactorAuthEnabled?: boolean;
}