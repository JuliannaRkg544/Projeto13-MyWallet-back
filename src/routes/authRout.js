import { Router } from "express";
import { validateSignup } from "../middlewares/authMiddleware.js";
import { signin, signup, logout } from "../controllers/userController.js";

const authRouter = Router();

authRouter.post("/signup", validateSignup, signup);
authRouter.post("/", signin);
authRouter.get("/logout", logout);

export default authRouter;
