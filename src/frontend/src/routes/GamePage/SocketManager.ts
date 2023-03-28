// import { io, Socket } from 'socket.io-client';
// // import { ClientEvents, ServerEvents } from './tmp';
// import { SocketState } from './SocketState';
// import { SetterOrUpdater } from 'recoil';
// // import { showNotification } from '@mantine/notifications';

// type EmitOptions<T> = {
//     event: string;
//     data?: T;
// };

// export type Listener<T> = (data: T) => void;

// export default class SocketManager {
//     public socket: Socket;

//     public setSocketState!: SetterOrUpdater<SocketState>;

//     private connectionLost: boolean = false;

//     /* front connects socket with back 5000 */
//     constructor() {
//       console.log('constructor in SocketManager');
//       this.socket = io('http://localhost:5000', {
//         autoConnect: false,
//         transports: ['websocket'],
//         withCredentials: true,
//       });

//       this.onConnect();
//       this.onDisconnect();
//     //   this.onException();
//     }

//     emit<T>(options: EmitOptions<T>): this {
//       this.socket.emit(options.event, options.data);
//       console.log('event from socket.emit: ');
//       console.log(options.event);
//       // console.log('data from socket.emit: ');
//       // console.log(options.data);
//       return this;
//     }

//     getSocketId(): string | null {
//       if (!this.socket.connected)
//         return null;

//       return this.socket.id;
//     }

//     connect(): void {
//       console.log('in sm.connect() -> call socket.connect() in SocketManager');
//       this.socket.connect(); // -> "Opens" the socket.
//     }

//     disconnect(): void {
//       this.socket.disconnect();
//     }

//     registerListener<T>(event: string, listener: Listener<T>): this {
//       this.socket.on(event, listener);
//       return this;
//     }

//     removeListener<T>(event: string, listener: Listener<T>): this {
//       this.socket.off(event, listener);
//       return this;
//     }

//     private onConnect(): void {
//       console.log('onConnect listening');
//       this.socket.on('connect', () => { // when socket got connected with this.socket.connect()
//         console.log('this.socket.on(connect, () => socket was listening to "connect" + got called');
//         // this.setSocketState((currVal) => {
//         //   return {...currVal, connected: true};
//         // });
//       });
//     }

//   /* from socket.d.ts:
//      export declare namespace Socket {
//        type DisconnectReason = "io server disconnect" | "io client disconnect" | "ping timeout" | "transport close" | "transport error" | "parse error";
//    } */
//     private onDisconnect(): void {
//       console.log('onDisconnect listening');
//       this.socket.on('disconnect', async (reason: Socket.DisconnectReason) => {
//         // if (reason === 'io client disconnect') {
//         //   showNotification({
//         //     message: 'Disconnected successfully!',
//         //     color: 'green',
//         //     autoClose: 2000,
//         //   });
//         // }

//         // if (reason === 'io server disconnect') {
//         //   showNotification({
//         //     message: 'You got disconnect by server',
//         //     color: 'orange',
//         //     autoClose: 3000,
//         //   });
//         // }

//         // if (reason === 'ping timeout' || reason === 'transport close' || reason === 'transport error') {
//         //   showNotification({
//         //     message: 'Connection lost to the server',
//         //     color: 'orange',
//         //     autoClose: 3000,
//         //   });
//         //   this.connectionLost = true;
//         // }

//         // this.setSocketState((currVal) => {
//         //   return {...currVal, connected: false};
//         // });
//       });
//     }

//     // private onException(): void {
//     //   this.socket.on('exception', (data: ServerExceptionResponse) => {
//     //     if (typeof data.exception === 'undefined') {
//     //       showNotification({
//     //         message: 'Unexpected error from server',
//     //         color: 'red',
//     //       });

//     //       return;
//     //     }

//     //     let body = `Error: ${data.exception}`;

//     //     if (data.message) {
//     //       if (typeof data.message === 'string') {
//     //         body += ` | Message: "${data.message}"`;
//     //       } else if (typeof data.message === 'object') {
//     //         body += ` | Message: "${JSON.stringify(data.message)}"`;
//     //       }
//     //     }

//     //     showNotification({
//     //       message: body,
//     //       color: 'red',
//     //     });
//     //   });
//     // }

// }

export const a = null;
