import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import authRouter from "./routes/authRout.js";
import transRouter from "./routes/transRout.js";

const server = express();

dotenv.config();

server.use(cors());
server.use(json());

server.use(authRouter);
server.use(transRouter);

server.listen(process.env.PORT, () => {
  console.log(chalk.blue.bold(`Servidor no ar`));
});
