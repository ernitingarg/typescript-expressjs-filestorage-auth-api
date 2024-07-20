import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./users/user.routes";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get("/healthcheck", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({ msg: "OK" });
});
app.use("/api", userRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
