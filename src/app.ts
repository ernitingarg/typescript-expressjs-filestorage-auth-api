import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./users/user.routes";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/", userRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
