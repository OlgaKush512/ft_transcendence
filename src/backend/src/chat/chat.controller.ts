import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  Query,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  BadRequestException,
  ForbiddenException,
  BadGatewayException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth42.service';
import { Request } from 'express';
import { AllowUnauthorizedRequest } from 'src/AllowUnauthorizedRequest';
import { UsersService } from 'src/users/users.service';
import {
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateRoomRequestDTO } from 'src/types/ChatCreateRoomRequest.dto';
import { CheckRoomNameRequestDTO } from 'src/types/ChatCheckRoomNameRequest.dto';
import { CheckRoomNameResponseDTO } from 'src/types/ChatCheckRoomNameResponse.dto';
import { JoinRoomRequestDTO } from 'src/types/ChatJoinRoomRequest.dto';
import { GetRoomsResponseDTO } from 'src/types/ChatGetRoomsResponse.dto';
import { CreateRoomResponseDTO } from 'src/types/ChatCreateRoomResponse.dto';
import { GetRoomRequestDTO } from 'src/types/ChatGetRoomRequest.dto copy';
import { GetRoomResponseDTO } from 'src/types/ChatGetRoomResponse.dto';
import { BanRequestDTO } from 'src/types/ChatBanRequest.dto';
import ChatRole, { ChatRoleType } from 'src/entities/chatRole.entity';
import { JoinRoomResponseDTO } from 'src/types/ChatJoinRoomResponse.dto';
import { GetMessagesRequestDTO } from 'src/types/ChatGetMessagesRequest.dto';
import { GetMessagesResponseDTO } from 'src/types/ChatGetMessagesResponse.dto';
import { GetPrivateRoomRequestDTO } from 'src/types/ChatGetPrivateRoomRequest.dto';
import { MuteRequestDTO } from 'src/types/ChatMuteRequest.dto';
import { UnmuteRequestDTO } from 'src/types/ChatUnmuteRequest.dto';
import { LeaveRoomRequestDTO } from 'src/types/ChatLeaveRoomRequest.dto';
import { ChatUpdateRoleRequestDTO } from 'src/types/ChatUpdateRoleRequest.dto';
import { ChangeRoomRequestDTO } from 'src/types/ChatChangeRoomRequest.dto';
import { ChatRoomType } from 'src/entities/chatRoom.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
  ) {}

  @Post('create-room')
  async createRoom(
    @Req() req: Request,
    @Body() body: CreateRoomRequestDTO,
  ): Promise<CreateRoomResponseDTO> {
    return {
      room: {
        ...(await this.chatService.createRoom(
          req.user.id,
          body.type,
          body.name,
          body.password,
        )),
        unreadMessages: 0,
      },
    };
  }

  @Get('rooms')
  async getRooms(@Req() req: Request): Promise<GetRoomsResponseDTO> {
    const user = await this.userService.findOneById(req.user.id);
    return { rooms: await this.chatService.getRooms(user) };
  }

  @Post('check-roomname')
  async checkRoomName(
    @Body() body: CheckRoomNameRequestDTO,
  ): Promise<CheckRoomNameResponseDTO> {
    return { exist: await this.chatService.checkRoomNameExists(body.name) };
  }

  @Post('join-room')
  async joinRoom(
    @Req() req: Request,
    @Body() body: JoinRoomRequestDTO,
  ): Promise<JoinRoomResponseDTO> {
    const user = await this.userService.findOneById(req.user.id);
    const room = await this.chatService.findRoomByName(body.roomName);
    await this.chatService.joinRoom(user, room, body.password);
    return {
      room: {
        ...room,
        lastMessage: null,
        unreadMessages: await this.chatService.unseenMessages(user, room),
      },
    };
  }

  @Post('leave-room')
  async leaveRoom(@Req() req: Request, @Body() body: LeaveRoomRequestDTO) {
    const user = await this.userService.findOneById(req.user.id);
    const room = await this.chatService.findRoomById(body.roomId);
    await this.chatService.leaveRoom(user, room);
  }

  @Get('room/:id')
  @ApiParam({ name: 'id', required: true, schema: { type: 'string' } })
  async getRoom(
    @Req() req: Request,
    @Param() param: GetRoomRequestDTO,
  ): Promise<GetRoomResponseDTO> {
    const user = await this.userService.findOneById(req.user.id);
    const room = await this.chatService.getRoom(user, param.id);
    
    if (!(await this.chatService.canAccessRoom(user.id, room.id)))
      throw new BadRequestException('User not member of this room');
    return { username: user.username, ...room };
  }

  @Post('ban')
  async ban(@Req() req: Request, @Body() body: BanRequestDTO) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByIdOrThrow(body.userId);
    const room = await this.chatService.findRoomById(body.roomId);
    const userRole = (await this.chatService.findRole(user, room)).role;

    if (userRole !== ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();

    await this.chatService.ban(user, target, room);
  }

  @Post('unban')
  async unban(@Req() req: Request, @Body() body: BanRequestDTO) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByIdOrThrow(body.userId);
    const room = await this.chatService.findRoomById(body.roomId);
    const userRole = (await this.chatService.findRole(user, room)).role;

    if (userRole !== ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();

    await this.chatService.unban(user, target, room);
  }

  @Get('messages')
  async getMessages(
    @Req() req: Request,
    @Query() query: GetMessagesRequestDTO,
  ): Promise<GetMessagesResponseDTO> {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const room = await this.chatService.findRoomById(query.roomId);
    return await this.chatService.getMessages(user, room, query.page);
  }

  @Get('private-room')
  async GetPrivateRoom(
    @Req() req: Request,
    @Query() query: GetPrivateRoomRequestDTO,
  ) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByUsername(query.user);
    if (!target) throw new BadGatewayException('User not found');
    const id = await this.chatService.getPrivateRoomId(user, target);
    if (!id) return this.chatService.createPrivateRoom(user, target);
    return id;
  }

  @Post('mute')
  async mute(@Req() req: Request, @Body() body: MuteRequestDTO) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByIdOrThrow(body.userId);
    const room = await this.chatService.findRoomById(body.roomId);
    const userRole = (await this.chatService.findRole(user, room)).role;
    const targetRole = (await this.chatService.findRole(target, room)).role;

    if (userRole !== ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();
    if (targetRole === ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();
    if (targetRole === ChatRoleType.Owner) throw new ForbiddenException();

    await this.chatService.mute(user, target, room, body.time);
  }

  @Post('unmute')
  async unmute(@Req() req: Request, @Body() body: UnmuteRequestDTO) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByIdOrThrow(body.userId);
    const room = await this.chatService.findRoomById(body.roomId);
    const userRole = (await this.chatService.findRole(user, room)).role;
    const targetRole = (await this.chatService.findRole(target, room)).role;

    if (userRole !== ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();
    if (targetRole === ChatRoleType.Admin && userRole !== ChatRoleType.Owner)
      throw new ForbiddenException();
    if (targetRole === ChatRoleType.Owner) throw new ForbiddenException();

    await this.chatService.unmute(user, target, room);
  }

  @Post('update-role')
  async updateRole(
    @Req() req: Request,
    @Body() body: ChatUpdateRoleRequestDTO,
  ) {
    const user = await this.userService.findOneByIdOrThrow(req.user.id);
    const target = await this.userService.findOneByIdOrThrow(body.userId);
    const room = await this.chatService.findRoomById(body.roomId);
    const userRole = (await this.chatService.findRole(user, room)).role;
    if (userRole !== ChatRoleType.Owner) throw new ForbiddenException(); // user must be owner
    if (body.role === 'owner') throw new BadRequestException(); // cannot set somebody else as a owner
    if (body.userId === user.id) throw new BadRequestException(); // cannot change self

    await this.chatService.updateRole(target, room, body.role);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() body: ChangeRoomRequestDTO,
  ) {
    const user = await this.userService.findOneById(req.user.id);
    const room = await this.chatService.findRoomById(body.roomId);
    const role = await this.chatService.findRole(user, room);
    if (room.type !== ChatRoomType.Protected)
      throw new BadRequestException('Room is not password protected');
    if (role.role !== ChatRoleType.Owner)
      throw new ForbiddenException(
        'Only the owner can change or remove the password',
      );

    await this.chatService.changePassword(
      user,
      room,
      body.oldPassword,
      body.newPassword,
    );
  }
}
