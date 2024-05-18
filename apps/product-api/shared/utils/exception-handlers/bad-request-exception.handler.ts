import { Request, Response, NextFunction } from "express";
import { BodyResponse, ExceptionResponse } from "../../types";

export const badRequestExceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name !== "BadRequestException") {
    return next(err);
  }

  const exceptionResponse: ExceptionResponse = err.getResponse
    ? (err.getResponse() as ExceptionResponse)
    : { message: err.message };

  const errorBody: BodyResponse = {
    status_code: 400,
    success: false,
    error: err.name,
  };

  if (Array.isArray(exceptionResponse.message)) {
    errorBody.messages = exceptionResponse.message;
  } else {
    errorBody.message = exceptionResponse.message;
  }

  return res.status(400).json(errorBody);
};
