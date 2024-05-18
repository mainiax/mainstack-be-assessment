import { Request, Response, NextFunction } from "express";
import { forbiddenExceptionHandler } from "./forbidden-exception.handler";
import { ForbiddenException } from "../exceptions";
import { ExceptionResponse } from "../../types";

describe("forbiddenExceptionHandler Middleware", () => {
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

  it("should pass non-ForbiddenException errors to the next middleware", () => {
    const error = { name: "OtherError", message: "Some other error" };

    forbiddenExceptionHandler(error, req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle ForbiddenException with single message", () => {
    const error = new ForbiddenException("Access denied", () => ({
      message: "Access denied",
    }));

    forbiddenExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 403,
      success: false,
      error: "ForbiddenException",
      message: "Access denied",
    });
  });

  it("should handle ForbiddenException with getResponse method returning multiple messages", () => {
    const exceptionResponse: ExceptionResponse = {
      message: ["Access denied", "You do not have permission"],
    };
    const error = new ForbiddenException(
      "Access denied",
      () => exceptionResponse
    );

    forbiddenExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 403,
      success: false,
      error: "ForbiddenException",
      messages: ["Access denied", "You do not have permission"],
    });
  });

  it("should handle ForbiddenException with getResponse method returning single message", () => {
    const exceptionResponse: ExceptionResponse = {
      message: "Access denied",
    };
    const error = new ForbiddenException(
      "Access denied",
      () => exceptionResponse
    );

    forbiddenExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 403,
      success: false,
      error: "ForbiddenException",
      message: "Access denied",
    });
  });
});
