import { Router } from "express";
import { userRouter } from "./user.route.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);
