import { Request, Response, NextFunction } from "express";
import { BodyResponse, ExceptionResponse } from "../../types";
import { ForbiddenException } from "../exceptions";

export const forbiddenExceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof ForbiddenException)) {
    return next(err);
  }

  const status = err.getStatus();
  const exceptionResponse: ExceptionResponse = err.getResponse
    ? (err.getResponse() as ExceptionResponse)
    : { message: err.message };

  const errorBody: BodyResponse = {
    status_code: status,
    success: false,
    error: err.name,
  };

  if (Array.isArray(exceptionResponse.message)) {
    errorBody.messages = exceptionResponse.message;
  } else {
    errorBody.message = exceptionResponse.message;
  }

  return res.status(403).json(errorBody);
};
