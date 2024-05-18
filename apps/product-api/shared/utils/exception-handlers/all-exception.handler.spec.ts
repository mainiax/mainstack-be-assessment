import { Request, Response, NextFunction } from "express";
import { exceptionHandler } from "./all-exception.handler";
import { ExceptionResponse } from "../../types";

describe("exceptionHandler Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
    next = jest.fn();
  });

  it("should handle CastError for invalid ObjectId", () => {
    const error = { name: "CastError", kind: "ObjectId" };

    exceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Invalid ID",
      message: "The provided ID is invalid.",
      status: 400,
      success: false,
    });
  });

  it("should handle MongoDB duplicate key error", () => {
    const error = { code: 11000, message: "Duplicate key error" };

    exceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Duplicate key",
      message: "Duplicate key error",
      status: 409,
      success: false,
    });
  });

  it("should handle custom exceptions with getResponse method", () => {
    const errorResponse: ExceptionResponse = {
      message: ["Custom error message"],
    };
    const error = {
      getResponse: jest.fn().mockReturnValue(errorResponse),
      getStatus: jest.fn().mockReturnValue(400),
      name: "CustomError",
      message: "Custom error occurred",
    };

    exceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "CustomError",
      message: "Custom error occurred",
      messages: ["Custom error message"],
    });
  });

  it("should handle custom exceptions without getResponse method", () => {
    const error = {
      getStatus: jest.fn().mockReturnValue(400),
      name: "CustomError",
      message: "Custom error occurred",
    };

    exceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "CustomError",
      message: "Custom error occurred",
    });
  });

  it("should handle generic errors", () => {
    const error = {
      name: "Error",
      message: "Something went wrong",
    };

    exceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 500,
      success: false,
      error: "Error",
      message: "Something went wrong",
    });
  });
});
