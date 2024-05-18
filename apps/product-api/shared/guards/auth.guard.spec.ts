import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authGuard } from "./auth.guard";
import { ForbiddenException } from "../utils/exceptions";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("authGuard Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no authorization token is provided", () => {
    authGuard(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No Authorization Token Provided",
    });
  });

  it("should call next with ForbiddenException if token is invalid", () => {
    req.headers = { authorization: "Bearer invalidtoken" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    authGuard(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ForbiddenException(
        "Invalid Authorization Token Provided",
        expect.any(Function)
      )
    );
  });

  it("should set req.user and call next if token is valid", () => {
    const mockUser = { id: "user_id", email: "user@example.com" };
    req.headers = { authorization: "Bearer validtoken" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    authGuard(req as Request, res as Response, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it("should handle missing Bearer prefix", () => {
    req.headers = { authorization: "validtoken" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, { id: "user_id", email: "user@example.com" });
    });

    authGuard(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No Authorization Token Provided",
    });
  });
});
