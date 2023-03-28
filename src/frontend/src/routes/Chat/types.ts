export type RoomType = 'public' | 'protected' | 'private';

export type Room = {
  id: string;
  name: string;
  lastMessage: Message | null;
  unreadMessages: number;
  type: 'public' | 'private' | 'protected';
};

export type Message = {
  from: string;
  text: string;
  sentAt: Date;
  room?: string;
  id: number;
};

/*
 Given a type T, convert Date objects to strings
*/
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

/*
 Deserialize a message received from a socket, converting back the dates to Date objects
 */
export function deserializeMessage(serializedMessage: null): null;
export function deserializeMessage(
  serializedMessage: Serialized<Message>,
): Message;
export function deserializeMessage(
  serializedMessage: Serialized<Message> | null,
): Message | null;
export function deserializeMessage(
  serializedMessage: Serialized<Message> | null,
): Message | null {
  if (!serializedMessage) return null;
  return { ...serializedMessage, sentAt: new Date(serializedMessage.sentAt) };
}
