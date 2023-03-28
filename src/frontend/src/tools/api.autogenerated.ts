/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FriendData {
  username: string;
  imageUrl: string;
}

export interface GetHomeDataResponseDTO {
  isInitialized: boolean;
  online: FriendData[];
  friends: FriendData[];
  inGame: FriendData[];
  stats: object[];
  merged: object;
}

export interface GetLobbyResponseDTO {
  merged: object;
}

export interface ChatRole {
  id: number;
  user: User;
  room: ChatRoom;
  role: 'owner' | 'admin' | 'member';
}

export interface ChatMessage {
  id: number;
  room: ChatRoom;
  text: string;
  /** @format date-time */
  sentAt: string;
  user: User;
  seenBy: object;
}

export interface ChatRoom {
  id: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  type: 'public' | 'private' | 'protected';
  password: string;
  roles: ChatRole[];
  messages: ChatMessage[];
  banned: User[];
}

export interface Notification {
  id: number;
  user: User;
  type:
    | 'friend_request_received'
    | 'friend_request_accepted'
    | 'friend_request_rejected'
    | 'game_invitation_received'
    | 'new_achievement'
    | 'new_message';
  /** @format date-time */
  date: string;
  content: string;
  isRead: boolean;
}

export interface Stats {
  id: number;
  user: User;
  played: number;
  wins: number;
  loses: number;
  points: number;
}

export interface Achievements {
  id: number;
  user: User;
  achievement1: boolean;
  achievement2: boolean;
  achievement3: boolean;
  achievement4: boolean;
  achievement5: boolean;
  achievement6: boolean;
  achievement7: boolean;
  achievement8: boolean;
  achievement9: boolean;
}

export interface Game {
  id: string;
  status: object;
  player1: User;
  player2: User;
  winnerId: number;
  player1Score: number;
  player2Score: number;
}

export interface User {
  id: number;
  username: string;
  login: string;
  email: string;
  intraId: number;
  connectionCounter: number;
  isTwoFactorAuthEnabled: boolean;
  imageUrl: string;
  isInitialized: boolean;
  sentFriendRequests: FriendRequest[];
  receivedFriendRequests: FriendRequest[];
  chatRooms: ChatRoom[];
  chatRoles: ChatRole[];
  bannedFrom: ChatRoom[];
  notifications: Notification[];
  stats: Stats;
  achievements: Achievements;
  gamesAsPlayer1: Game;
  gamesAsPlayer2: Game;
}

export interface FriendRequest {
  id: number;
  status: object;
  creator: User;
  receiver: User;
}

export interface CheckUsernameExistRequestDTO {
  /**
   * @minLength 2
   * @maxLength 20
   * @pattern /^[a-zA-Z0-9_]*$/
   */
  username: string;
}

export interface CheckUsernameExistResponseDTO {
  exist: boolean;
}

export interface CreateNewProfileRequestDTO {
  /** @format binary */
  file: File;
  /**
   * @minLength 2
   * @maxLength 20
   * @pattern /^[a-zA-Z0-9_]*$/
   */
  username: string;
}

export interface CheckUserInitializedResponseDTO {
  isInitialized: boolean;
}

export interface UserUpdateProfileRequestDTO {
  /**
   * @minLength 2
   * @maxLength 20
   * @pattern /^[a-zA-Z0-9_]*$/
   */
  username?: string;
  isTwoFactorAuthEnabled?: boolean;
}

export interface UserRequestFriendRequestDTO {
  /**
   * @minLength 2
   * @maxLength 20
   * @pattern /^[a-zA-Z0-9_]*$/
   * @example "sev"
   */
  username: string;
}

export interface UserGetBlockedResponseDTO {
  blocked: FriendData[];
}

export interface UserBlockRequestDTO {
  username: string;
}

export interface UserGetProfileResponseDTO {
  initialized: boolean;
  username: string;
  firstName: string;
  lastName: string;
  login: string;
  imageUrl: string;
  stats: object;
  gameHistory: object;
  isFriend: boolean;
  isRequested: boolean;
  isBlocked: boolean;
  rank: number;
  twoFactorAuthEnabled: boolean;
  achievements: object;
}

export interface UserSearchDataDTO {
  id: number;
  username: string;
  login: string;
  imageUrl: string;
  isFriend: boolean;
  isBlocked: boolean;
}

export interface SearchResponseDTO {
  users: UserSearchDataDTO[];
}

export interface NotificationFriendRequestReceivedContentDTO {
  friend: {
    id: number;
    username: string;
  };
}

export interface NotificationDTO {
  type:
    | 'friend_request_received'
    | 'friend_request_accepted'
    | 'friend_request_rejected'
    | 'game_invitation_received'
    | 'new_achievement'
    | 'new_message';
  id: number;
  /** @format date-time */
  date: string;
  isRead: boolean;
  content: NotificationFriendRequestReceivedContentDTO;
}

export interface GetNotificationsResponseDTO {
  notifications: NotificationDTO[];
}

export interface MarkReadRequestDTO {
  ids: number[];
}

export interface GamePlayerDTO {
  user: FriendData;
  stats: object;
}

export interface GameGetInfoResponseDTO {
  player1: GamePlayerDTO;
  player2: GamePlayerDTO;
}

export interface TwoFactorAuthVerifyCodeDTO {
  /** @minLength 4 */
  code: string;
}

export interface TwoFactorAuthVerifyCodeResponseDTO {
  status: 'ok' | 'ko';
  error?: 'Invalid Code' | 'Account Blocked' | 'Code Expired';
  /** @format date-time */
  until?: string;
  triesLeft?: number;
}

export interface CreateRoomRequestDTO {
  type: 'public' | 'private' | 'protected';
  password?: string;
  name: string;
}

export interface ChatMessageDTO {
  text: string;
  from: string;
  /** @format date-time */
  sentAt: string;
  id: number;
}

export interface ChatRoomData {
  type: 'private' | 'public' | 'protected';
  name: string;
  id: string;
  lastMessage: ChatMessageDTO | null;
  unreadMessages: number;
}

export interface CreateRoomResponseDTO {
  room: ChatRoomData;
}

export interface GetRoomsResponseDTO {
  rooms: ChatRoomData[];
}

export interface CheckRoomNameRequestDTO {
  name: string;
}

export interface CheckRoomNameResponseDTO {
  exist: boolean;
}

export interface JoinRoomRequestDTO {
  roomName: string;
  password: string;
}

export interface JoinRoomResponseDTO {
  room: ChatRoomData;
}

export interface LeaveRoomRequestDTO {
  roomId: string;
}

export interface ChatRoomUserDTO {
  id: number;
  username: string;
  role: 'owner' | 'admin' | 'member';
  imageUrl: string;
  muted: boolean;
  inGame: boolean;
  gameId: string | null;
}

export interface GetRoomResponseDTO {
  type: 'public' | 'private' | 'protected';
  username: string;
  id: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  users: ChatRoomUserDTO[];
  messages: ChatMessageDTO[];
  hasMoreMessages: boolean;
  role: 'owner' | 'admin' | 'member';
  muted: boolean;
  banned: object[];
}

export interface BanRequestDTO {
  roomId: string;
  userId: number;
}

export interface GetMessagesResponseDTO {
  messages: ChatMessageDTO[];
  hasMore: boolean;
}

export interface MuteRequestDTO {
  roomId: string;
  userId: number;
  time: '30s' | '5m' | '1h';
}

export interface UnmuteRequestDTO {
  roomId: string;
  userId: number;
}

export interface ChatUpdateRoleRequestDTO {
  roomId: string;
  userId: number;
  role: 'owner' | 'admin' | 'member';
}

export interface ChangeRoomRequestDTO {
  roomId: string;
  oldPassword: string;
  newPassword: string;
}

export interface SendInvitationRequestDTO {
  gameType: 'classic' | 'bonus';
  username: string;
}

export interface AcceptInvitationRequestDTO {
  lobbyId: string;
}

export interface AcceptInvitationResponseDTO {
  gameId: string;
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { 'Content-Type': type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Transcendence
 * @version 1.0
 * @contact
 *
 * Transcendence backend API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name AppControllerGetHomeData
     * @request GET:/api/home
     */
    appControllerGetHomeData: (params: RequestParams = {}) =>
      this.request<GetHomeDataResponseDTO, any>({
        path: `/api/home`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AppControllerGetUsersStatus
     * @request GET:/api/users-status
     */
    appControllerGetUsersStatus: (params: RequestParams = {}) =>
      this.request<GetLobbyResponseDTO, any>({
        path: `/api/users-status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerIntraAuth
     * @request GET:/api/auth/42/login
     */
    auth42ControllerIntraAuth: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/42/login`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerIntraAuthRedirect
     * @request GET:/api/auth/42/callback
     */
    auth42ControllerIntraAuthRedirect: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/42/callback`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerProtected
     * @request GET:/api/auth/42/protected
     */
    auth42ControllerProtected: (params: RequestParams = {}) =>
      this.request<object, void>({
        path: `/api/auth/42/protected`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerCreateFakeUser
     * @request GET:/api/auth/42/create-fake-user
     */
    auth42ControllerCreateFakeUser: (
      query: {
        id: number;
        email: string;
        login: string;
        first_name: string;
        last_name: string;
        usual_full_name: string;
        url: string;
        displayname: string;
        image_url: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/42/create-fake-user`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerLoginFakeUser
     * @request GET:/api/auth/42/login-fake
     */
    auth42ControllerLoginFakeUser: (
      query: {
        email: string;
        login: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/42/login-fake`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name Auth42ControllerDisconnect
     * @request GET:/api/auth/42/sign-out
     */
    auth42ControllerDisconnect: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/42/sign-out`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerListAll
     * @request GET:/api/users/all
     */
    usersControllerListAll: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/api/users/all`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerCheckUsername
     * @request POST:/api/users/check-username
     */
    usersControllerCheckUsername: (
      data: CheckUsernameExistRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<CheckUsernameExistResponseDTO, any>({
        path: `/api/users/check-username`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerCreateProfile
     * @request POST:/api/users/create-profile
     */
    usersControllerCreateProfile: (
      data: CreateNewProfileRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/users/create-profile`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerUpdatePhoto
     * @request POST:/api/users/update-photo
     */
    usersControllerUpdatePhoto: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/update-photo`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetFile
     * @request GET:/api/users/image/{image}
     */
    usersControllerGetFile: (image: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/image/${image}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerCheckInitialized
     * @request GET:/api/users/check-initialized
     */
    usersControllerCheckInitialized: (params: RequestParams = {}) =>
      this.request<CheckUserInitializedResponseDTO, any>({
        path: `/api/users/check-initialized`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerUpdateProfile
     * @request POST:/api/users/update-profile
     */
    usersControllerUpdateProfile: (
      data: UserUpdateProfileRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/users/update-profile`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerRequestFriend
     * @request POST:/api/users/request-friend
     */
    usersControllerRequestFriend: (
      data: UserRequestFriendRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/request-friend`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerAcceptFriend
     * @request POST:/api/users/accept-friend
     */
    usersControllerAcceptFriend: (
      data: UserRequestFriendRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/accept-friend`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerDeclineFriend
     * @request POST:/api/users/decline-friend
     */
    usersControllerDeclineFriend: (
      data: UserRequestFriendRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/decline-friend`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerRemoveFriend
     * @request POST:/api/users/remove-friend
     */
    usersControllerRemoveFriend: (
      data: UserRequestFriendRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/remove-friend`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetFriends
     * @request GET:/api/users/friends
     */
    usersControllerGetFriends: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/friends`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetBlocked
     * @request GET:/api/users/blocked
     */
    usersControllerGetBlocked: (params: RequestParams = {}) =>
      this.request<UserGetBlockedResponseDTO, any>({
        path: `/api/users/blocked`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerBlock
     * @request POST:/api/users/block
     */
    usersControllerBlock: (
      data: UserBlockRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/block`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerUnblock
     * @request POST:/api/users/unblock
     */
    usersControllerUnblock: (
      data: UserBlockRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/unblock`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetProfile
     * @request GET:/api/users/profile
     */
    usersControllerGetProfile: (params: RequestParams = {}) =>
      this.request<UserGetProfileResponseDTO, any>({
        path: `/api/users/profile`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetOtherProfile
     * @request GET:/api/users/profile/{username}
     */
    usersControllerGetOtherProfile: (
      username: string,
      params: RequestParams = {},
    ) =>
      this.request<UserGetProfileResponseDTO, any>({
        path: `/api/users/profile/${username}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerSearchUser
     * @request GET:/api/users/search
     */
    usersControllerSearchUser: (
      query: {
        query: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SearchResponseDTO, any>({
        path: `/api/users/search`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerEnable2Fa
     * @request POST:/api/users/enable-2fa
     */
    usersControllerEnable2Fa: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/enable-2fa`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerDisable2Fa
     * @request POST:/api/users/disable-2fa
     */
    usersControllerDisable2Fa: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/disable-2fa`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetOngoingGames
     * @request GET:/api/users/games
     */
    usersControllerGetOngoingGames: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/games`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name NotificationsControllerGetNotifications
     * @request GET:/api/notifications
     */
    notificationsControllerGetNotifications: (params: RequestParams = {}) =>
      this.request<GetNotificationsResponseDTO, any>({
        path: `/api/notifications`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name NotificationsControllerMarkRead
     * @request POST:/api/notifications/read
     */
    notificationsControllerMarkRead: (
      data: MarkReadRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/read`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name GameControllerGetInfo
     * @request GET:/api/game/info/{id}
     */
    gameControllerGetInfo: (id: string, params: RequestParams = {}) =>
      this.request<GameGetInfoResponseDTO, any>({
        path: `/api/game/info/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name TwoFactorAuthControllerVerify
     * @request POST:/api/auth/2fa/verify
     */
    twoFactorAuthControllerVerify: (
      data: TwoFactorAuthVerifyCodeDTO,
      params: RequestParams = {},
    ) =>
      this.request<TwoFactorAuthVerifyCodeResponseDTO, any>({
        path: `/api/auth/2fa/verify`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name TwoFactorAuthControllerResendCode
     * @request POST:/api/auth/2fa/resend-code
     */
    twoFactorAuthControllerResendCode: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/2fa/resend-code`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name TwoFactorAuthControllerGetStatus
     * @request GET:/api/auth/2fa/status
     */
    twoFactorAuthControllerGetStatus: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/2fa/status`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerCreateRoom
     * @request POST:/api/chat/create-room
     */
    chatControllerCreateRoom: (
      data: CreateRoomRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<CreateRoomResponseDTO, any>({
        path: `/api/chat/create-room`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerGetRooms
     * @request GET:/api/chat/rooms
     */
    chatControllerGetRooms: (params: RequestParams = {}) =>
      this.request<GetRoomsResponseDTO, any>({
        path: `/api/chat/rooms`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerCheckRoomName
     * @request POST:/api/chat/check-roomname
     */
    chatControllerCheckRoomName: (
      data: CheckRoomNameRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<CheckRoomNameResponseDTO, any>({
        path: `/api/chat/check-roomname`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerJoinRoom
     * @request POST:/api/chat/join-room
     */
    chatControllerJoinRoom: (
      data: JoinRoomRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<JoinRoomResponseDTO, any>({
        path: `/api/chat/join-room`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerLeaveRoom
     * @request POST:/api/chat/leave-room
     */
    chatControllerLeaveRoom: (
      data: LeaveRoomRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/leave-room`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerGetRoom
     * @request GET:/api/chat/room/{id}
     */
    chatControllerGetRoom: (id: string, params: RequestParams = {}) =>
      this.request<GetRoomResponseDTO, any>({
        path: `/api/chat/room/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerBan
     * @request POST:/api/chat/ban
     */
    chatControllerBan: (data: BanRequestDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/chat/ban`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerUnban
     * @request POST:/api/chat/unban
     */
    chatControllerUnban: (data: BanRequestDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/chat/unban`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerGetMessages
     * @request GET:/api/chat/messages
     */
    chatControllerGetMessages: (
      query: {
        roomId: string;
        page: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetMessagesResponseDTO, any>({
        path: `/api/chat/messages`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerGetPrivateRoom
     * @request GET:/api/chat/private-room
     */
    chatControllerGetPrivateRoom: (
      query: {
        user: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/api/chat/private-room`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerMute
     * @request POST:/api/chat/mute
     */
    chatControllerMute: (data: MuteRequestDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/chat/mute`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerUnmute
     * @request POST:/api/chat/unmute
     */
    chatControllerUnmute: (
      data: UnmuteRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/unmute`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerUpdateRole
     * @request POST:/api/chat/update-role
     */
    chatControllerUpdateRole: (
      data: ChatUpdateRoleRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/update-role`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name ChatControllerChangePassword
     * @request POST:/api/chat/change-password
     */
    chatControllerChangePassword: (
      data: ChangeRoomRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/change-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name MatchmakingControllerSendInvitation
     * @request POST:/api/matchmaking/invite
     */
    matchmakingControllerSendInvitation: (
      data: SendInvitationRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/matchmaking/invite`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name MatchmakingControllerCancelInvitation
     * @request POST:/api/matchmaking/cancel
     */
    matchmakingControllerCancelInvitation: (
      data: SendInvitationRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/matchmaking/cancel`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name MatchmakingControllerAcceptInvitation
     * @request POST:/api/matchmaking/accept
     */
    matchmakingControllerAcceptInvitation: (
      data: AcceptInvitationRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<AcceptInvitationResponseDTO, any>({
        path: `/api/matchmaking/accept`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name MatchmakingControllerDeclineInvitation
     * @request POST:/api/matchmaking/decline
     */
    matchmakingControllerDeclineInvitation: (
      data: AcceptInvitationRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/matchmaking/decline`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
