import { Router } from "express";
import { addEntry } from "../controllers/transactionsController.js";

//criar um roteador e rotear

const transRouter = Router();

transRouter.post("/entries", addEntry);

export default transRouter;
