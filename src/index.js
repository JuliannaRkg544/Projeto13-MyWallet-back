import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { signin, signup } from "./controllers/userControllers.js";

const server = express();

server.use(cors());
server.use(json());

dotenv.config();

server.listen(process.env.PORT, () => {
  console.log(chalk.blue.bold(`Servidor no ar`));
});

const mongo = new MongoClient(process.env.MONGO_URL);
let database = null;

const promise = mongo.connect();

promise
  .then(() => {
    database = mongo.db(process.env.BANCO);
    console.log(chalk.green.bold(`deu bom na conexão com o database`));
  })
  .catch((e) => {
    console.log(chalk.red.bold("deu ruim na conexão"), e);
  });

server.post("/signup", signup);

server.post("/", signin);
