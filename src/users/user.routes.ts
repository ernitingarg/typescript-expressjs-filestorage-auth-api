import express, { Request, Response } from "express";
import * as db from "../users/user.database";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.interface";

export const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users: User[] = await db.findAll();
    if (!users) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No user found" });
    }

    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

userRouter.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await db.findOne(req.params.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No user found with id ${req.params.id}` });
    }

    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all the required parameters." });
    }

    const dbUser = await db.findByEmail(email);
    if (dbUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `User already exists with email id ${email}` });
    }

    const newUser = await db.createUser(req.body);
    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

userRouter.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all required parameters" });
    }

    const dbUser = await db.findOne(req.params.id);
    if (!dbUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No user found with id ${req.params.id}` });
    }

    const updateUser = await db.updateUser(req.params.id, req.body);

    return res.status(StatusCodes.ACCEPTED).json(updateUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

userRouter.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const dbUser = await db.findOne(req.params.id);
    if (!dbUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No user found with id ${req.params.id}` });
    }

    await db.removeUser(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ msg: "User deleted successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});
