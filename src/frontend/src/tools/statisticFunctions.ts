import { user } from '../data/data';

export const myRate = (users: user[]) => {
  const myIndex = users.findIndex((person) => person.me);
  return myIndex + 1;
};

export function sortPeopleFriend(users: user[]) {
  const usersOnlineSortedByFriend = [...users];
  usersOnlineSortedByFriend.sort((a, b) =>
    a['friend'] > b['friend'] ? -1 : 1
  );
  return usersOnlineSortedByFriend;
}

export function sortPeoplReating(users: user[]) {
  const usersSortedByWin = [...users];
  usersSortedByWin.sort((a, b) => (a['win'] > b['win'] ? -1 : 1));
  return usersSortedByWin;
}

export function sortedPeopleOnline(users: user[]) {
  const newArray = [...users];

  const sortedPeopleOnline = newArray.filter((user) => user.online);
  return sortedPeopleOnline;
}

export const sumOfPoints = (user: user) => {
  const theUser = { ...user };

  let sum: number = 0;

  for (let i: number = 0; i < theUser.historyOfGame.length; ++i) {
    sum += theUser.historyOfGame[i].pointsWin;
  }
  return sum;
};
