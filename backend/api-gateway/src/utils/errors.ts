import { Response } from 'express';
import { logger } from './logger';

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Application Error Base Class
 * Provides structured error handling following production standards
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: HttpStatus,
    public readonly message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(HttpStatus.BAD_REQUEST, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: Record<string, unknown>) {
    super(HttpStatus.UNAUTHORIZED, message, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: Record<string, unknown>) {
    super(HttpStatus.FORBIDDEN, message, 'AUTHORIZATION_ERROR', details);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Resource Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, details?: Record<string, unknown>) {
    super(
      HttpStatus.NOT_FOUND,
      `${resource} not found`,
      'NOT_FOUND_ERROR',
      details,
    );
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(HttpStatus.CONFLICT, message, 'CONFLICT_ERROR', details);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Service Unavailable Error
 */
export class ServiceUnavailableError extends AppError {
  constructor(service: string, details?: Record<string, unknown>) {
    super(
      HttpStatus.SERVICE_UNAVAILABLE,
      `${service} is temporarily unavailable`,
      'SERVICE_UNAVAILABLE_ERROR',
      details,
    );
    this.name = 'ServiceUnavailableError';
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: Record<string, unknown>) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR', details);
    this.name = 'InternalServerError';
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Determine if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatusCode(error: unknown): HttpStatus {
  if (isAppError(error)) {
    return error.statusCode;
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

/**
 * Send error response
 */
export function sendErrorResponse(res: Response, error: unknown): void {
  const statusCode = getErrorStatusCode(error);

  if (isAppError(error)) {
    logger.warn('AppError occurred', {
      code: error.code,
      message: error.message,
      statusCode,
    });

    res.status(statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  } else if (error instanceof Error) {
    logger.error('Unexpected error occurred', error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      },
    });
  } else {
    logger.error('Unknown error occurred', { error });

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}
