import { Router } from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionsController.js";
import { getUser } from "../middlewares/userMiddleare.js";

const transRouter = Router();
transRouter.use(getUser);

transRouter.post("/transactions", addTransaction);
transRouter.get("/transactions", getTransactions);

export default transRouter;
