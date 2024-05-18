import "express";

declare global {
  namespace Express {
    interface Response {
      message?: string;
    }
    interface Request {
      user?: any;
    }
  }
}
