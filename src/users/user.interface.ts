export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface User extends IUser {
  id: string;
}

export interface Users {
  [key: string]: User;
}
