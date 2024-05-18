import { Schema, model } from "mongoose";
import { IUser } from "../product-api/user/user.type";
import bcrypt from "bcrypt";
import MongooseDelete, { SoftDeleteModel } from "mongoose-delete";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.deleted;
        delete ret.deletedAt;
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

export default model<IUser, SoftDeleteModel<IUser>>("user", userSchema);
