import { Request, Response, NextFunction } from "express";
import { httpExceptionHandler } from "./http-exception.handler";
import { HttpException } from "../exceptions";
import { ExceptionResponse } from "../../types";

describe("httpExceptionHandler Middleware", () => {
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

  it("should pass non-HttpException errors to the next middleware", () => {
    const error = { name: "OtherError", message: "Some other error" };

    httpExceptionHandler(error, req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle HttpException with single message", () => {
    const error = new HttpException("Something went wrong", 400, () => ({
      message: "Something went wrong",
    }));

    httpExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "HttpException",
      message: "Something went wrong",
    });
  });

  it("should handle HttpException with getResponse method returning multiple messages", () => {
    const exceptionResponse: ExceptionResponse = {
      message: ["Error 1", "Error 2"],
    };
    const error = new HttpException(
      "Something went wrong",
      400,
      () => exceptionResponse
    );

    httpExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "HttpException",
      messages: ["Error 1", "Error 2"],
    });
  });

  it("should handle HttpException with getResponse method returning single message", () => {
    const exceptionResponse: ExceptionResponse = {
      message: "Single error message",
    };
    const error = new HttpException(
      "Something went wrong",
      400,
      () => exceptionResponse
    );

    httpExceptionHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status_code: 400,
      success: false,
      error: "HttpException",
      message: "Single error message",
    });
  });
});
