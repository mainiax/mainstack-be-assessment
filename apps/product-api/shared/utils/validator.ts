import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { ValidationException } from "./exceptions";

const Validator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      ...(req.file?.fieldname && { [req.file?.fieldname]: req.file }),
    };

    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });

    if (!error) {
      req.body = value;
      next();
    } else {
      const errors: { [key: string]: string } = {};
      error.details.forEach((cur) => {
        const key = (cur.context?.label || cur.context?.key) as string;
        errors[key] = cur.message.replace(/"/g, "");
      });

      const errorMessages = Object.values(errors);
      return next(
        new ValidationException(errorMessages[0], () => ({
          message: Object.values(errors),
        }))
      );
    }
  };
};

export default Validator;
