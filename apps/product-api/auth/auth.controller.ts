import { Response, Request, NextFunction } from "express";
import { IUser } from "../user/user.type";
import User from "../../models/user.model";
import { HttpException } from "../shared/utils/exceptions";
import jwt from "jsonwebtoken";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: IUser | null = await User.findOne({
      email: req.body.email,
    });

    if (!user || !user.comparePassword(req.body.password)) {
      throw new HttpException("Invalid Email or Password", 400, () => ({
        message: "Invalid Email or Password",
      }));
    }

    const token = jwt.sign(
      { email: user.email, firstName: user.firstName, _id: user._id },
      process.env.JWT_KEY!
    );

    res.message = "Login successful";
    res.status(200).json({ user, token });
  } catch (error) {
    return next(error);
  }
};
