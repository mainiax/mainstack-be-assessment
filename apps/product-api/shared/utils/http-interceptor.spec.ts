import { NextFunction, Request, Response } from "express";
import { BodyResponse } from "../types";
import { httpInterceptor } from "./http-interceptor";

describe("httpInterceptor Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      statusCode: 200,
      json: jsonMock,
      message: undefined,
    };
    next = jest.fn();
  });

  it("should wrap response in BodyResponse format for successful requests", () => {
    const data: any = { key: "value" };
    const expectedResponse: BodyResponse = {
      status_code: res.statusCode ?? 200,
      success: true,
      message: res.message || "Request was successful",
      data,
    };

    httpInterceptor(req as Request, res as Response, next);

    (res.json as jest.Mock)(data);

    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
    expect(next).toHaveBeenCalled();
  });

  it("should not wrap response in BodyResponse format for error responses", () => {
    const errorData = { error: "Something went wrong" };
    res.statusCode = 500;

    httpInterceptor(req as Request, res as Response, next);

    (res.json as jest.Mock)(errorData);

    expect(jsonMock).toHaveBeenCalledWith(errorData);
    expect(next).toHaveBeenCalled();
  });

  it("should use custom message if provided in the response", () => {
    const data: any = { key: "value" };
    res.message = "Custom success message";
    const expectedResponse: BodyResponse = {
      status_code: res.statusCode ?? 200,
      success: true,
      message: res.message || "Request was successful",
      data,
    };

    httpInterceptor(req as Request, res as Response, next);

    (res.json as jest.Mock)(data);

    expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
    expect(next).toHaveBeenCalled();
  });
});
