import { Request, Response } from "express";

export const createMockRequest = (
  options?: Partial<Request>
): Partial<Request> => {
  const req: Partial<Request> = {
    body: {},
    params: {},
    query: {},
    ...options,
  };
  return req;
};

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
  return res;
};
