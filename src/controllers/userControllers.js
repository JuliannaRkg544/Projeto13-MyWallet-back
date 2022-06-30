import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const mongo = new MongoClient(process.env.MONGO_URL);
let database = null;

export async function signup(req, res) {
  const { name, email, password, passwordConfirmation } = req.body;
  const schemaName = joi.object({
    name: joi.string().required(),
  });

  const regexEmail = /^(.+)@(.+)$/;

  const schemaEmail = joi.object({
    email: joi.string().pattern(regexEmail).required(),
  });
  const schemaPassword = joi.object({
    password: joi.required(),
  });
  const schemaPasswordConfirmation = joi.object({
    passwordConfirmation: joi.ref(password),
  });

  //preciso validar as info
  const validateName = schemaName.validate({ name });
  const validateEmail = schemaEmail.validate({ email });
  const validatePassword = schemaPassword.validate({ password });
  const validatePasswordConfirmation = schemaPasswordConfirmation.validate({
    passwordConfirmation,
  });

  if (validateEmail.error) {
    console.log("erro no email", validateEmail.error.details);
    res.status(422).send("email inválido");
    return;
  }
  if (validatePassword.error) {
    console.log("erro na senha", validatePassword.error.details);
    res.status(422).send("senha inválida");
    return;
  }
  if (validateName.error) {
    console.log("erro no nome", validateName.error.details);
    res.status(422).send("nome inválido");
    return;
  }
  if (validatePasswordConfirmation.error) {
    console.log("erro na senha 2", validatePasswordConfirmation.error.details);
    res.status(422).send("as senhas não n batem");
    return;
  }

  //preciso criptografar a senha
  const passwordHash = bcrypt.hashSync(password, 10); //gerando uma hash para senha

  //enviar cadastro para bd

  try {
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
    const user = await database.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      //preciso gerar um token
      const token = uuid();
      //criar uma sessão
      await database.collection("session").insertOne({
        userId: user._id,
        token,
      });
      const data = token;
      console.log("token", token);
      res.send(data);
    } else {
      console.log("user n encontrado");
    }
  } catch (error) {
    console.log("erro ao achar o usuário", error);
    res.status(422).send("usuário não encontrado!");
    return;
  }
}
