import { ExceptionResponse } from "../types";

export class ForbiddenException extends Error {
  constructor(
    public message: string,
    public getResponse?: () => ExceptionResponse
  ) {
    super(message);
    this.name = "ForbiddenException";
  }

  getStatus() {
    return 403;
  }
}

export class HttpException extends Error {
  private readonly status: number;

  constructor(
    public message: string,
    status: number,
    public getResponse?: () => ExceptionResponse
  ) {
    super(message);
    this.status = status;
    this.name = "HttpException";
  }

  getStatus() {
    return this.status;
  }
}

export class NotFoundException extends Error {
  constructor(
    public message: string,
    public getResponse?: () => ExceptionResponse
  ) {
    super(message);
    this.name = "NotFoundException";
  }

  getStatus() {
    return 404;
  }
}

export class ValidationException extends Error {
  constructor(
    public message: string,
    public getResponse?: () => ExceptionResponse
  ) {
    super(message);
    this.name = "ValidationExpception";
  }

  getStatus() {
    return 422;
  }
}
