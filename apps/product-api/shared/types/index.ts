import { SaveOptions } from "mongoose";
import { Model } from "mongoose";

export interface PaginationParams {
  limit?: number;
  page?: number;
}

export interface PaginationResult<T> {
  data: T[];
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface ExceptionResponse {
  message: string | string[];
}

export interface BodyResponse<T = void> {
  data?: T;
  error?: any;
  success: boolean;
  message?: string;
  messages?: string[];
  status_code: number;
}
