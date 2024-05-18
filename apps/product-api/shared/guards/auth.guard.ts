import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenException } from "../utils/exceptions";

export const authGuard = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No Authorization Token Provided" });

  jwt.verify(token, process.env.JWT_KEY as string, (err: any, user: any) => {
    if (err) {
      return next(
        new ForbiddenException("Invalid Authorization Token Provided", () => ({
          message: "Invalid Authorization Token Provided",
        }))
      );
    }

    req.user = user;

    next();
  });
};
