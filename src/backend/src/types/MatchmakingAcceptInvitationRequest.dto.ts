import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInvitationRequestDTO {
  @IsNotEmpty()
  @IsString()
  lobbyId: string;
}
