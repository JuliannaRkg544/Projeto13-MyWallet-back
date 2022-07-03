import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import database from "../dataBase.js";
import joi from "joi";

export async function signup(req, res) {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const alreadyIsuser = await database.collection("users").findOne({ email });
    if (alreadyIsuser) {
      res.status(422).send("Email já cadastrado");
    }
    await database.collection("users").insertOne({
      name,
      email,
      password: passwordHash,
    });
  } catch (error) {
    console.log("erro ao enviar user para o database", error);
    res.sendStatus(500);
    return;
  }
  const data = {
    name,
    email,
    password: passwordHash,
  };
  res.status(201).send(data);
}

export async function signin(req, res) {
  const { email, password } = req.body;
  //procurar email no banco de dados para gerar token
  try {
    const user = await database.collection("users").findOne({ email: email });
    if (user && bcrypt.compareSync(password, user.password)) {
      //preciso gerar um token
      const token = uuid();
      //criar uma sessão
      await database.collection("session").insertOne({
        userId: user._id,
        token,
      });
      const data = { token, name: user.name };
      console.log("token", token, " name ", user.name);
      return res.send(data);
    } else {
      console.log("user n encontrado");
      return res.sendStatus(404);
    }
  } catch (error) {
    console.log("erro ao achar o usuário", error);
    res.status(500).send("erro ao achar o usuário!");
    return;
  }
}

export async function logout(req, res) {
  const token = req.header; // um objto com o token
  //token = authorization?.replace("Bearer", "").trim(); //remove espaços em branco
  //const token = authorization?.replace("Bearer", "").trim();
  console.log("token do back ", token);
  if (!token) {
    res.sendStatus(403);
    return;
  }
  try {
    await database.collection("session").deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    console.log("Error ao deslogar");
    console.log(error);
    res.sendStatus(500);
    return;
  }
}
