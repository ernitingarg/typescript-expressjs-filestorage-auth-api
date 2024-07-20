import { IUser, User, Users } from "./user.interface";
import fs from "fs";
import { v4 as random } from "uuid";
import bcrypt from "bcryptjs";

let users = loadUsers();

function loadUsers(): Users {
  try {
    const data = fs.readFileSync("./users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error while loading users : ${error}`);
    return {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
    console.log("Users saved successfully!!");
  } catch (error) {
    console.log(`Error while saving users: ${error}`);
  }
}

export const findAll = async (): Promise<User[]> => Object.values(users);

export const findOne = async (id: string): Promise<User> => users[id];

export const findByEmail = async (emailId: string): Promise<null | User> => {
  const allUsers = await findAll();
  if (!allUsers) {
    return null;
  }

  const user = allUsers.find((x) => x.email == emailId);
  if (!user) {
    return null;
  }

  return user;
};

export const createUser = async (user: IUser): Promise<User> => {
  const id = random();
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(user.password, salt);

  const dbUser: User = {
    id: id,
    username: user.username,
    email: user.email,
    password: hashPassword,
  };

  users[id] = dbUser;
  saveUsers();

  return dbUser;
};

export const updateUser = async (
  id: string,
  user: IUser
): Promise<null | User> => {
  const dbUser = await findOne(id);
  if (!dbUser) {
    return null;
  }

  // Update the user with new values
  users[id] = {
    ...dbUser, // existing user details
    ...user, // new details to update
  };

  saveUsers();

  return users[id];
};

export const removeUser = async (id: string): Promise<null | void> => {
  const dbUser = await findOne(id);

  if (!dbUser) {
    return null;
  }

  delete users[id];
  saveUsers();
};
