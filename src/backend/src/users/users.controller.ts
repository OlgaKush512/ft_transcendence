import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import User from 'src/entities/user.entity';
import { UserAcceptFriendRequestDTO } from 'src/types/UserAcceptFriendRequest.dto';
import { UserAcceptFriendResponseDTO } from 'src/types/UserAcceptFriendResponse.dto';
import { CheckUserInitializedResponseDTO } from 'src/types/UserCheckUserInitializedResponse.dto';
import { CheckUsernameExistResponseDTO } from 'src/types/UserCheckUsernameExistResponse.dto';
import { UserGetBlockedResponseDTO } from 'src/types/UserGetBlockedResponse.dto';
import { UserGetFriendsRequestDTO } from 'src/types/UserGetFriendsRequest.dto';
import { UserGetFriendsResponseDTO } from 'src/types/UserGetFriendsResponse.dto';
import { UserGetOtherProfileRequestDTO } from 'src/types/UserGetOtherProfileRequest.dto';
import { UserGetProfileResponseDTO } from 'src/types/UserGetProfileResponse.dto';
import { UserRequestFriendRequestDTO } from 'src/types/UserRequestFriendRequest.dto';
import { UserRequestFriendResponseDTO } from 'src/types/UserRequestFriendResponse.dto';
import { SearchRequestDTO } from 'src/types/UserSearchRequest.dto';
import { SearchResponseDTO } from 'src/types/UserSearchResponse.dto';
import { UserUpdateProfileRequestDTO } from 'src/types/UserUpdateProfileRequest.dto';
import { CheckUsernameExistRequestDTO } from '../types/UserCheckUsernameExistRequest.dto';
import {
  CreateNewProfileRequestDTO,
  CreateProfileImageFilePipe,
} from '../types/UserCreateNewProfileRequest.dto';
import { UsersService } from './users.service';
import Achievements from 'src/entities/achievements.entity';
import { UserBlockRequestDTO } from 'src/types/UserBlockRequest.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get('all')
  async listAll() {
    return await this.usersService.listAll();
  }

  @Post('check-username')
  async checkUsername(
    @Body() body: CheckUsernameExistRequestDTO,
  ): Promise<CheckUsernameExistResponseDTO> {
    return {
      exist: await this.usersService.checkUsernameExist(body.username),
    };
  }

  @Post('create-profile')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async createProfile(
    @Req() req: Request,
    @UploadedFile(CreateProfileImageFilePipe) file: Express.Multer.File,
    @Body() _: CreateNewProfileRequestDTO,
    @Body('username') username: string,
  ) {
    
    return await this.usersService.createNewProfile(req, username, file);
  }

  @Post('update-photo')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async updatePhoto(
    @Req() req: Request,
    @UploadedFile(CreateProfileImageFilePipe) file: Express.Multer.File,
  ) {
    return await this.usersService.updatePhoto(req, file);
  }

  @Get('image/:image')
  @ApiParam({
    name: 'image',
    required: true,
    description: 'image id',
    schema: { type: 'string' },
  })
  async getFile(@Res() res: Response, @Param('image') image) {
    const file = createReadStream(
      join(this.configService.get<string>('IMAGE_UPLOAD_DEST'), image),
    );
    file.pipe(res);
  }

  @Get('check-initialized')
  async checkInitialized(
    @Req() req: Request,
  ): Promise<CheckUserInitializedResponseDTO> {
    return {
      isInitialized: await this.usersService.isInitialized(req.user.id),
    };
  }

  @Post('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body() body: UserUpdateProfileRequestDTO,
  ): Promise<User> {
    return await this.usersService.updateUser(req.user.id, body);
  }

  @Post('request-friend')
  async requestFriend(
    @Req() req: Request,
    @Body() body: UserRequestFriendRequestDTO,
  ) {
    return await this.usersService.sendFriendRequest(
      req.user.id,
      body.username,
    );
  }

  @Post('accept-friend')
  async acceptFriend(
    @Req() req: Request,
    @Body() body: UserRequestFriendRequestDTO,
  ) {
    await this.usersService.acceptFriendRequest(req.user.id, body.username);
    return;
  }

  @Post('decline-friend')
  async declineFriend(
    @Req() req: Request,
    @Body() body: UserRequestFriendRequestDTO,
  ) {
    await this.usersService.declineFriendRequest(req.user.id, body.username);
    return;
  }

  @Post('remove-friend')
  async removeFriend(
    @Req() req: Request,
    @Body() body: UserRequestFriendRequestDTO,
  ) {
    await this.usersService.removeFriend(req.user.id, body.username);
    return;
  }

  @Get('friends')
  async getFriends(@Req() req: Request) {
    const user = await this.usersService.findOneByIdOrThrow(req.user.id);
    return await this.usersService.getFriendsAndBlockedData(user);
    // const friends = (await this.usersService.getFriends(req.user.id)).friends;
    // return {friends: await Promise.all(friends.map(async friend => this.usersService.getStats()))}
  }

  @Get('blocked')
  async getBlocked(@Req() req: Request): Promise<UserGetBlockedResponseDTO> {
    return await this.usersService.getBlocked(req.user.id);
  }

  @Post('block')
  async block(@Req() req: Request, @Body() body: UserBlockRequestDTO) {
    return this.usersService.blockUser(req.user.id, body.username);
  }

  @Post('unblock')
  async unblock(@Req() req: Request, @Body() body: UserBlockRequestDTO) {
    return this.usersService.unblockUser(req.user.id, body.username);
  }

  @Get('profile')
  async getProfile(@Req() req: Request): Promise<UserGetProfileResponseDTO> {
    const user = await this.usersService.findOneByIdOrThrow(req.user.id);
    return {
      initialized: user.isInitialized,
      username: user.username,
      firstName: req.user.intraProfile.first_name,
      lastName: req.user.intraProfile.last_name,
      imageUrl: user.imageUrl,
      login: user.login,
      gameHistory: await this.usersService.getHistory(user),
      stats: await this.usersService.getStats(user),
      isBlocked: false,
      isFriend: false,
      isRequested: false,
      rank: await this.usersService.getRank(user),
      twoFactorAuthEnabled: user.isTwoFactorAuthEnabled,
      achievements: await this.usersService.getAchievementsList(user),
    };
  }

  @Get('profile/:username')
  async getOtherProfile(
    @Req() req: Request,
    @Param() param: UserGetOtherProfileRequestDTO,
  ): Promise<UserGetProfileResponseDTO> {
    const me = await this.usersService.findOneByIdOrThrow(req.user.id);
    const other = await this.usersService.findOneByUsername(param.username);
    
    if (!other) throw new BadRequestException('user not found');
    return {
      initialized: null,
      username: other.username,
      firstName: null,
      lastName: null,
      imageUrl: other.imageUrl,
      login: other.login,
      gameHistory: await this.usersService.getHistory(other),
      stats: await this.usersService.getStats(other),
      isBlocked: await this.usersService.isBlockedBy(me, other),
      isFriend: await this.usersService.isFriendWith(me, other),
      isRequested: await this.usersService.isFriendRequested(me, other),
      rank: await this.usersService.getRank(other),
      twoFactorAuthEnabled: null,
      achievements: await this.usersService.getAchievementsList(other),
    };
  }

  @Get('search')
  async searchUser(
    @Req() req: Request,
    @Query() query: SearchRequestDTO,
  ): Promise<SearchResponseDTO> {
    const me = await this.usersService.findOneByIdOrThrow(req.user.id);
    return { users: await this.usersService.searchUser(me, query.query) };
  }

  @Post('enable-2fa')
  async enable2FA(@Req() req: Request) {
    const user = await this.usersService.findOneByIdOrThrow(req.user.id);
    this.usersService.enableTwoFactorAuth(user);
  }

  @Post('disable-2fa')
  async disable2FA(@Req() req: Request) {
    const user = await this.usersService.findOneByIdOrThrow(req.user.id);
    this.usersService.disableTwoFactorAuth(user);
  }

  @Get('games')
  async getOngoingGames(@Req() req: Request) {
    return await this.usersService.getOngoingGames();
  }
}
