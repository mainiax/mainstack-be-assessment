import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import { loginUser } from "./auth.controller";
import { HttpException } from "../shared/utils/exceptions";

jest.mock("../../models/user.model");
jest.mock("jsonwebtoken");

describe("loginUser Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        email: "testuser@example.com",
        password: "Password123",
      },
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

  it("should login user successfully with valid credentials", async () => {
    const mockUser = {
      _id: "user_id",
      email: "testuser@example.com",
      firstName: "Test",
      comparePassword: jest.fn().mockReturnValue(true),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue("mocked_jwt_token");

    await loginUser(req as Request, res as Response, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        email: mockUser.email,
        firstName: mockUser.firstName,
        _id: mockUser._id,
      },
      process.env.JWT_KEY
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: mockUser,
      token: "mocked_jwt_token",
    });
  });

  it("should return error if user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(next).toHaveBeenCalledWith(
      new HttpException("Invalid Email or Password", 400, expect.any(Function))
    );
  });

  it("should return error if password is incorrect", async () => {
    const mockUser = {
      _id: "user_id",
      email: "testuser@example.com",
      firstName: "Test",
      comparePassword: jest.fn().mockReturnValue(false),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await loginUser(req as Request, res as Response, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
    expect(next).toHaveBeenCalledWith(
      new HttpException("Invalid Email or Password", 400, expect.any(Function))
    );
  });

  it("should handle unexpected errors", async () => {
    const error = new Error("Unexpected error");
    (User.findOne as jest.Mock).mockRejectedValue(error);

    await loginUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
