import { Request, Response, NextFunction } from "express";
import { BodyResponse, ExceptionResponse } from "../../types";
import { HttpException } from "../exceptions";

export const httpExceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof HttpException)) {
    return next(err);
  }

  const status = err.getStatus() || 500;
  const exceptionResponse: ExceptionResponse = err.getResponse
    ? err.getResponse()
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

  return res.status(status).json(errorBody);
};
