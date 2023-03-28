export interface user {
  id: string;
  me: boolean;
  online: boolean;
  username: string;
  name: string;
  surname: string;
  friend: boolean;
  isBlocked: boolean;
  isPlaying: boolean;
  img: string;
  numbeGame: number;
  win: number;
  historyOfGame: match[];
  isInvited: boolean;
}

export interface match {
  opponent: string;
  isWin: boolean;
  pointsWin: number;
  pointsLost: number;
}

export const users: user[] = [
  {
    id: 'okushnir',
    me: true,
    online: true,
    username: 'okushnir',
    name: 'Olga',
    surname: 'Kushnirova',
    friend: true,
    isBlocked: false,
    isPlaying: false,
    img: 'https://cdn.intra.42.fr/users/2e3b8baabb877b8cb89160fc4a209459/okushnir.jpg',
    numbeGame: 17,
    win: 15,
    historyOfGame: [
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'amyroshn',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'dzybin',
        isWin: false,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'amyroshn',
        isWin: false,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'threiss',
        isWin: true,
        pointsWin: 1,
        pointsLost: 3,
      },
      {
        opponent: 'dzybin',
        isWin: true,
        pointsWin: 8,
        pointsLost: 3,
      },
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 3,
        pointsLost: 3,
      },
      {
        opponent: 'threiss',
        isWin: true,
        pointsWin: 10,
        pointsLost: 3,
      },
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 7,
        pointsLost: 2,
      },
      {
        opponent: 'threiss',
        isWin: true,
        pointsWin: 6,
        pointsLost: 3,
      },
      {
        opponent: 'ddiakova',
        isWin: true,
        pointsWin: 5,
        pointsLost: 4,
      },
      {
        opponent: 'sferard',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 6,
        pointsLost: 4,
      },
      {
        opponent: 'sferard',
        isWin: true,
        pointsWin: 8,
        pointsLost: 2,
      },
      {
        opponent: 'ddiakova',
        isWin: true,
        pointsWin: 3,
        pointsLost: 1,
      },
    ],
    isInvited: false,
  },
  {
    id: 'cmarteau',
    me: false,
    online: true,
    username: 'cmarteau',
    name: 'Capucine',
    surname: 'Marteau',
    friend: true,
    isBlocked: false,
    isPlaying: true,
    img: 'https://cdn.intra.42.fr/users/9f0a91e97042ae840a9a1681b47183d7/cmarteau.jpg',
    numbeGame: 10,
    win: 8,
    historyOfGame: [
      {
        opponent: 'ddiakova',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'threiss',
    me: false,
    online: true,
    username: 'threiss',
    name: 'Theresa',
    surname: 'Reiss',
    friend: true,
    isBlocked: false,
    isPlaying: false,
    img: 'https://cdn.intra.42.fr/users/f36a757a74e1a99591e4bb8d1015f7f9/threiss.jpg',
    numbeGame: 9,
    win: 5,
    historyOfGame: [
      {
        opponent: 'cmarteau',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'sferard',
    me: false,
    online: true,
    username: 'sferard',
    name: 'Séverin',
    surname: 'Férard',
    friend: true,
    isBlocked: false,
    isPlaying: false,
    img: 'https://cdn.intra.42.fr/users/3710d8a2732390d37aa4207607bba4d0/sferard.jpg',
    numbeGame: 15,
    win: 11,
    historyOfGame: [
      {
        opponent: 'threiss',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'bolmos-o',
    me: false,
    online: true,
    username: 'bolmos-o',
    name: 'Bruno',
    surname: 'Olmos Osorio',
    friend: false,
    isBlocked: false,
    isPlaying: true,
    img: 'https://cdn.intra.42.fr/users/2c865e86024ccb7ed137a43bafe0147f/bolmos-o.jpg',
    numbeGame: 14,
    win: 12,
    historyOfGame: [
      {
        opponent: 'sferard',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'amyroshn',
    me: false,
    online: true,
    username: 'amyroshn',
    name: 'Anton',
    surname: 'Myroshnychenko',
    friend: true,
    isBlocked: false,
    isPlaying: true,
    img: 'https://cdn.intra.42.fr/users/db9bb507df18fc0d91b16199467c1d75/amyroshn.jpg',
    numbeGame: 19,
    win: 16,
    historyOfGame: [
      {
        opponent: 'bolmos-o',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'cbeaurai',
    me: false,
    online: true,
    username: 'cbeaurai',
    name: 'Clement',
    surname: 'Beaurain',
    friend: false,
    isBlocked: true,
    isPlaying: false,
    img: 'https://cdn.intra.42.fr/users/2037f62f68129337097ca8a0efc5f4f0/cbeaurai.jpg',
    numbeGame: 13,
    win: 7,
    historyOfGame: [
      {
        opponent: 'sferard',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'dzybin',
    me: false,
    online: false,
    username: 'dzybin',
    name: 'Dmytro',
    surname: 'Zybin',
    friend: true,
    isBlocked: false,
    isPlaying: false,
    img: 'https://cdn.intra.42.fr/users/a46884c9b5dc5fd2829cf3ddfe1ad59f/dzybin.jpg',
    numbeGame: 3,
    win: 2,
    historyOfGame: [
      {
        opponent: 'cbeaurai',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
  {
    id: 'ddiakova',
    me: false,
    online: false,
    username: 'ddiakova',
    name: 'Daria',
    surname: 'Diakova',
    friend: false,
    isBlocked: true,
    isPlaying: true,
    img: 'https://cdn.intra.42.fr/users/202255b82453593a913e7b6a0ee2f2d0/ddiakova.jpg',
    numbeGame: 9,
    win: 8,
    historyOfGame: [
      {
        opponent: 'sferard',
        isWin: true,
        pointsWin: 7,
        pointsLost: 3,
      },
    ],
    isInvited: false,
  },
];
