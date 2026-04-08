/**
 * Global Type Definitions
 * Provides TypeScript interfaces and types used across the microservice
 */

/**
 * Extended Express Request with custom fields
 */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Standard API Response Envelope
 */
export interface ApiResponseEnvelope<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Service Response with metadata
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}
