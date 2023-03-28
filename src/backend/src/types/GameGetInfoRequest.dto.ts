import { IsNotEmpty, IsString } from 'class-validator';

export class GameGetInfoRequestDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
