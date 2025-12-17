import { getAuth } from "@clerk/express";
import { Router } from "express";
import {
  createThread,
  getThreadById,
  listCategories,
} from "../modules/threads/threads.repository.js";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
import { z } from "zod";
import { getUserFromClerk } from "../modules/users/user.service.js";

export const threadRouter = Router();

const CreatedThreadSchema = z.object({
  title: z.string().trim().min(5).max(200),
  body: z.string().trim().min(10).max(2000),
  categorySlug: z.string().trim().min(1),
});

threadRouter.get("/categories", async (_req, res, next) => {
  try {
    const extractListOfCategories = await listCategories();

    res.json({ data: extractListOfCategories });
  } catch (error) {
    next(error);
  }
});

threadRouter.post("/threads", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const parsedBody = CreatedThreadSchema.parse(req.body);

    const profile = await getUserFromClerk(auth.userId);

    const newlyCreatedThread = await createThread({
      categorySlug: parsedBody.categorySlug,
      authorUserId: profile.user.id,
      title: parsedBody.title,
      body: parsedBody.body,
    });

    res.status(201).json({ data: newlyCreatedThread });
  } catch (error) {
    next(error);
  }
});

threadRouter.post("/threads/:threadId", async (req, res, next) => {
  try {
    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread id");
    }

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    // const profile = await getUserFromClerk(auth.userId);

    // const viewerUserId = profile.user.id;

    const thread = await getThreadById(threadId);

    res.json({ data: thread });

    res.json({ data: thread });
  } catch (error) {
    next(error);
  }
});
