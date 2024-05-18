import {
  ForbiddenException,
  HttpException,
  NotFoundException,
  ValidationException,
} from "./exceptions";

describe("Custom Exception Classes", () => {
  describe("ForbiddenException", () => {
    it("should create a ForbiddenException with the correct properties", () => {
      const message = "Access denied";
      const getResponse = jest.fn().mockReturnValue({ message: "Forbidden" });

      const exception = new ForbiddenException(message, getResponse);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe("ForbiddenException");
      expect(exception.message).toBe(message);
      expect(exception.getResponse).toBe(getResponse);
      expect(exception.getStatus()).toBe(403);
    });
  });

  describe("HttpException", () => {
    it("should create an HttpException with the correct properties", () => {
      const message = "Something went wrong";
      const status = 500;
      const getResponse = jest
        .fn()
        .mockReturnValue({ message: "Internal Server Error" });

      const exception = new HttpException(message, status, getResponse);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe("HttpException");
      expect(exception.message).toBe(message);
      expect(exception.getResponse).toBe(getResponse);
      expect(exception.getStatus()).toBe(status);
    });
  });

  describe("NotFoundException", () => {
    it("should create a NotFoundException with the correct properties", () => {
      const message = "Resource not found";
      const getResponse = jest.fn().mockReturnValue({ message: "Not Found" });

      const exception = new NotFoundException(message, getResponse);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe("NotFoundException");
      expect(exception.message).toBe(message);
      expect(exception.getResponse).toBe(getResponse);
      expect(exception.getStatus()).toBe(404);
    });
  });

  describe("ValidationException", () => {
    it("should create a ValidationException with the correct properties", () => {
      const message = "Validation failed";
      const getResponse = jest
        .fn()
        .mockReturnValue({ message: "Validation Error" });

      const exception = new ValidationException(message, getResponse);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.name).toBe("ValidationExpception");
      expect(exception.message).toBe(message);
      expect(exception.getResponse).toBe(getResponse);
      expect(exception.getStatus()).toBe(422);
    });
  });
});
