import { Document } from "mongoose";
import { IUser } from "../user/user.type";

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  imageUrl: string;
}

export type ILoginPayload = Pick<IUser, "email" | "password">;
