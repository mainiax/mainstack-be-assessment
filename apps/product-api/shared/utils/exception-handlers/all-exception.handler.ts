import { Request, Response, NextFunction } from "express";
import { BodyResponse, ExceptionResponse } from "../../types";

const mongodbCodes = {
  bulkWriteError: 11000,
};

export const exceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const exceptionResponse: null | ExceptionResponse = err.getResponse
    ? (err.getResponse() as ExceptionResponse)
    : null;
  const status: number = err.getStatus ? err.getStatus() : 500;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      error: "Invalid ID",
      message: "The provided ID is invalid.",
      status: 400,
      success: false,
    });
  }

  if (err.code === mongodbCodes.bulkWriteError) {
    return res.status(409).json({
      error: "Duplicate key",
      message: err.message,
      status: 409,
      success: false,
    });
  }

  const errorBody: BodyResponse = {
    status_code: status,
    success: false,
    error: err.name,
    message: err.message,
  };

  if (exceptionResponse) {
    if (Array.isArray(exceptionResponse.message)) {
      errorBody.messages = exceptionResponse.message;
    } else {
      errorBody.message = exceptionResponse.message;
    }
  }

  return res.status(status).json(errorBody);
};
