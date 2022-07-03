import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import database from "../dataBase.js";
import joi from "joi";

export async function addEntry(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();
  const task = req.body;

  console.log(token);
  const entry = {
    value: task.value,
    desc: task.desc,
    type: task.type,
    user: token,
  };
  try {
    await database.collection("transactions").insertOne(entry);
    res.sendStatus(201);
  } catch (error) {
    console.log("erro ao cadastar entrada", error);
  }
}
