import { Router } from "express";
import { userRouter } from "./user.route.js";
import { threadRouter } from "./thread.route.js";
import { notificationsRouter } from "./notification.route.js";
import { chatRouter } from "./chat.route.js";
import { uploadRouter } from "./upload.route.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);
apiRouter.use("/threads", threadRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/upload", uploadRouter);
