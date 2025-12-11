import type { Response, Request, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../lib/errors.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (!auth.userId) {
    return next(
      new UnauthorizedError("You must be signed in to access this route.")
    );
  }

  return next();
}
