import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Request } from 'express';
import { NewSoloResponseDTO } from 'src/types/MatchmakingNewSoloResponse.dto';
import { AllowUnauthorizedRequest } from 'src/AllowUnauthorizedRequest';
import { UsersService } from 'src/users/users.service';
import { SendInvitationRequestDTO } from 'src/types/NotificationsSendInvitationRequest.dto';
import { AcceptInvitationRequestDTO } from 'src/types/MatchmakingAcceptInvitationRequest.dto';
import { AcceptInvitationResponseDTO } from 'src/types/MatchmakingAcceptInvitationResponse.dto';

@Controller('/api/matchmaking')
export class MatchmakingController {
  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly userService: UsersService,
  ) {}

  @Post('invite')
  async sendInvitation(
    @Req() req: Request,
    @Body() body: SendInvitationRequestDTO,
  ) {
    return this.matchmakingService.sendInvitation(
      req.user.id,
      body.username,
      body.gameType,
    );
  }

  @Post('cancel')
  async cancelInvitation(
    @Req() req: Request,
    @Body() body: SendInvitationRequestDTO,
  ) {
    return this.matchmakingService.cancelInvitation(req.user.id, body.username);
  }

  @Post('accept')
  async acceptInvitation(
    @Req() req: Request,
    @Body() body: AcceptInvitationRequestDTO,
  ): Promise<AcceptInvitationResponseDTO> {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const game = await this.matchmakingService.acceptInvitation(
      user,
      body.lobbyId,
    );
    return { gameId: game.id };
  }

  @Post('decline')
  async declineInvitation(
    @Req() req: Request,
    @Body() body: AcceptInvitationRequestDTO,
  ) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const game = await this.matchmakingService.rejectInvitation(
      user,
      body.lobbyId,
    );
  }
}
