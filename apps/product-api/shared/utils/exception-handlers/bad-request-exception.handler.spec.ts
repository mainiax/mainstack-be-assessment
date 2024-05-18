import { Request, Response, NextFunction } from "express";
import { badRequestExceptionHandler } from "./bad-request-exception.handler";
import { ExceptionResponse } from "../../types";

describe("badRequestExceptionHandler Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
    next = jest.fn() as jest.Mock<NextFunction>;
  });

  it("should pass non-BadRequestException errors to the next middleware", () => {
    const error = { name: "OtherError", message: "Some other error" };

    badRequestExceptionHandler(error, req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle BadRequestException with single message", () => {
    const error = {
      name: "BadRequestException",
      message: "Bad request error occurred",
    };

    badRequestExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "BadRequestException",
      message: "Bad request error occurred",
    });
  });

  it("should handle BadRequestException with getResponse method", () => {
    const exceptionResponse: ExceptionResponse = {
      message: ["Invalid input", "Missing fields"],
    };
    const error = {
      name: "BadRequestException",
      getResponse: jest.fn().mockReturnValue(exceptionResponse),
    };

    badRequestExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "BadRequestException",
      messages: ["Invalid input", "Missing fields"],
    });
  });

  it("should handle BadRequestException with getResponse method returning single message", () => {
    const exceptionResponse: ExceptionResponse = {
      message: "Invalid input",
    };
    const error = {
      name: "BadRequestException",
      getResponse: jest.fn().mockReturnValue(exceptionResponse),
    };

    badRequestExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "BadRequestException",
      message: "Invalid input",
    });
  });
});
