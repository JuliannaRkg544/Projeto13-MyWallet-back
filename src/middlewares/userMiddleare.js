import database from "../dataBase.js";

export async function getUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();

  if (!token) return res.status(401).send("No token found."); // unauthorized

  try {
    const session = await database.collection("session").findOne({ token });
    if (!session) return res.status(401).send("No session found."); // unauthorized

    const user = await database
      .collection("users")
      .findOne({ _id: session.userId });
    if (!user) return res.status(401).send("No user found."); // unauthorized

    res.locals.user = user;
    next();
  } catch (error) {
    console.log("Erro ao tentar obter usuário através da sessão");
    console.log(error);
    return res.sendStatus(500);
  }
}
