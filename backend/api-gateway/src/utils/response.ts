import { Response } from 'express';

/**
 * Standard API Response Structure
 * Provides consistent response format across all endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path?: string;
}

/**
 * Send success response
 */
export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
): Response {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    data,
    timestamp: new Date().toISOString(),
    ...(message && { message }),
  });
}

/**
 * Send paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export function sendPaginatedResponse<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  statusCode: number = 200,
): Response {
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;

  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasMore,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Parse pagination parameters from query
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
}

export function parsePaginationParams(
  queryPage?: string | number,
  queryPageSize?: string | number,
  defaultPageSize: number = 20,
  maxPageSize: number = 100,
): PaginationParams {
  let page = parseInt(String(queryPage || '1'), 10);
  let pageSize = parseInt(String(queryPageSize || defaultPageSize), 10);

  // Validate and sanitize
  page = Math.max(1, Math.min(page, Number.MAX_SAFE_INTEGER));
  pageSize = Math.max(1, Math.min(pageSize, maxPageSize));

  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}
