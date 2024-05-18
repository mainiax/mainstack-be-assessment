import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../exceptions";
import { BodyResponse, ExceptionResponse } from "../../types";

export const notFoundExceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof NotFoundException)) {
    return next(err);
  }

  const status = err.getStatus();
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
