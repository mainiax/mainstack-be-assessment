import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import Validator from "./validator";
import { ValidationException } from "./exceptions";

interface CustomRequest extends Omit<Request, "file"> {
  file?: {
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: any;
  };
}

describe("Validator Middleware", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    file: Joi.any().optional(),
  });

  beforeEach(() => {
    req = {
      body: {},
      file: undefined,
    };
    res = {};
    next = jest.fn() as jest.Mock<NextFunction>;
  });

  it("should call next with no error if validation passes", () => {
    req.body = { name: "John Doe", email: "john.doe@example.com" };

    const middleware = Validator(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  it("should call next with ValidationException if validation fails", () => {
    req.body = { name: "John Doe" };
    const middleware = Validator(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationException));
    const validationException = next.mock.calls[0][0] as ValidationException;
    expect(validationException.message).toBe("email is required");
    expect(validationException.getResponse!().message).toEqual([
      "email is required",
    ]);
  });

  it("should include file in validation if file is present", () => {
    req.body = { name: "John Doe", email: "john.doe@example.com" };
    req.file = {
      fieldname: "file",
      originalname: "test.png",
      mimetype: "image/png",
      buffer: Buffer.from(""),
      size: 1024,
    };

    const schemaWithFile = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      file: Joi.object().required(),
    });

    const middleware = Validator(schemaWithFile);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
      file: req.file,
    });
  });

  it("should handle multiple validation errors", () => {
    req.body = {};

    const middleware = Validator(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationException));
    const validationException = next.mock.calls[0][0] as ValidationException;
    expect(validationException.message).toBe("name is required");
    expect(validationException.getResponse!().message).toEqual([
      "name is required",
      "email is required",
    ]);
  });

  it("should strip unknown properties and call next if validation passes", () => {
    req.body = {
      name: "John Doe",
      email: "john.doe@example.com",
      unknownProperty: "should be removed",
    };

    const middleware = Validator(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  it("should convert values and call next if validation passes", () => {
    const schemaWithNumber = Joi.object({
      number: Joi.number().required(),
    });

    req.body = {
      number: "123",
    };

    const middleware = Validator(schemaWithNumber);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      number: 123,
    });
  });
});
