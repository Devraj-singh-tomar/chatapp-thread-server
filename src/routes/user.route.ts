import { Router } from "express";
import { z } from "zod";
import {
  ToUserProfileResponse,
  type UserProfileType,
  type UserProfileResponseType,
} from "../modules/users/user.types.js";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../lib/errors.js";
import { getUserFromClerk } from "../modules/users/user.service.js";

export const userRouter = Router();

// User Update Schema
export const userProfileUpdateSchema = z.object({
  displayName: z.string().trim().max(50).optional(),
  handle: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.url("avatar must ne valid url").optional(),
});

function toResponse(profile: UserProfileType): UserProfileResponseType {
  return ToUserProfileResponse(profile);
}

// GET -> /api/me
userRouter.get("/", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const profile = await getUserFromClerk(auth.userId);
    const response = toResponse(profile);

    res.json({ data: response });
  } catch (error) {
    next(error);
  }
});

// PATCH -> /api/me
