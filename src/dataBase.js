import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let database = null;
const mongo = new MongoClient(process.env.MONGO_URL);

try {
  await mongo.connect();
  database = mongo.db(process.env.BANCO);
  console.log(chalk.green.bold(`deu bom na conexão com o database`));
} catch (e) {
  console.log(chalk.red.bold("deu ruim na conexão"), e);
}

export default database;
