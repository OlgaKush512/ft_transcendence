import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { GetHomeDataResponseDTO } from './types/GetHomeDataResponse.dto';
import { GetLobbyResponseDTO } from './types/GetLobbyResponse.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @Get('/api/home')
  async getHomeData(@Req() req: Request): Promise<GetHomeDataResponseDTO> {
    const user = await this.userService.findOneById(req.user.id);
    return await this.appService.getDashboardData(user);
  }

  @Get('/api/users-status')
  async getUsersStatus(@Req() req: Request): Promise<GetLobbyResponseDTO> {
    const user = await this.userService.findOneById(req.user.id);
    return {merged: (await this.appService.getUsers(user)).merged};
  }
}
