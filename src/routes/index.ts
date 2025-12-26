import { Router } from "express";
import { userRouter } from "./user.route.js";
import { threadRouter } from "./thread.route.js";
import { notificationsRouter } from "./notification.route.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);
apiRouter.use("/threads", threadRouter);
apiRouter.use("/notifications", notificationsRouter);
