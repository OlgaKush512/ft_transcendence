import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class CheckUsernameExistRequestDTO {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9_]*$/)
  username: string;
}
