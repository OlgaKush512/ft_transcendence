import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGetInfoRequestDTO } from 'src/types/GameGetInfoRequest.dto';
import { GameGetInfoResponseDTO } from 'src/types/GameGetInfoResponse.dto';

@Controller('api/game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('info/:id')
  getInfo(
    @Param() params: GameGetInfoRequestDTO,
  ): Promise<GameGetInfoResponseDTO> {
    return this.gameService.getGameInfo(params.id);
  }
}
