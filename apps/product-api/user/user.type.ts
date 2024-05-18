import { SoftDeleteDocument } from "mongoose-delete";

export interface IUser extends SoftDeleteDocument {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  comparePassword(password: string): boolean;
}
