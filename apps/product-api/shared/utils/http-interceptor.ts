import { NextFunction, Request, Response } from "express";
import { BodyResponse } from "../types";

export const httpInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const original = res.json.bind(res);

  res.json = (data: any) => {
    if (res.statusCode >= 400) {
      return original(data);
    }

    const response: BodyResponse = {
      status_code: res.statusCode,
      success: true,
      message: res.message || "Request was successful",
      data,
    };

    return original(response);
  };

  next();
};
