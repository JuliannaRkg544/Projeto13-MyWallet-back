import database from "../dataBase.js";

export async function addTransaction(req, res) {
  const task = req.body;
  const { user } = res.locals;

  try {
    //await database.collection("session").findOne({ userId: user._id });
    await database.collection("transactions").insertOne({
      value: task.value,
      desc: task.desc,
      type: task.type,
      userId: user._id,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log("erro ao cadastar transação", error);
    res.sendStatus(500);
  }
}
export async function getTransactions(req, res) {
  const { user } = res.locals;

  try {
    const transactions = await database
      .collection("transactions")
      .find({ userId: user._id })
      .toArray();
    res.status(200).send(transactions);
  } catch (error) {
    console.log("erro no get das transações ", error);
    res.sendStatus(500);
  }
}
