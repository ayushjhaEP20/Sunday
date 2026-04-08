import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Validation Rules Type
 */
export interface ValidationRules {
  [field: string]: ValidationRule[];
}

export interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

/**
 * Common Validation Rules
 */
export const ValidationRules = {
  required: (fieldName: string): ValidationRule => ({
    validate: (value: unknown) => value !== undefined && value !== null && value !== '',
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    validate: (value: unknown) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailRegex.test(value);
    },
    message: 'Invalid email format',
  }),

  minLength: (fieldName: string, length: number): ValidationRule => ({
    validate: (value: unknown) => typeof value === 'string' && value.length >= length,
    message: `${fieldName} must be at least ${length} characters long`,
  }),

  maxLength: (fieldName: string, length: number): ValidationRule => ({
    validate: (value: unknown) => typeof value === 'string' && value.length <= length,
    message: `${fieldName} must not exceed ${length} characters`,
  }),

  isNumber: (fieldName: string): ValidationRule => ({
    validate: (value: unknown) => typeof value === 'number' && !isNaN(value),
    message: `${fieldName} must be a number`,
  }),

  isArray: (fieldName: string): ValidationRule => ({
    validate: (value: unknown) => Array.isArray(value),
    message: `${fieldName} must be an array`,
  }),

  isUUID: (): ValidationRule => ({
    validate: (value: unknown) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return typeof value === 'string' && uuidRegex.test(value);
    },
    message: 'Invalid UUID format',
  }),

  isPositive: (fieldName: string): ValidationRule => ({
    validate: (value: unknown) => typeof value === 'number' && value > 0,
    message: `${fieldName} must be a positive number`,
  }),
};

/**
 * Request Validation Middleware Factory
 * Validates request body, query, and params against rules
 */
export function validateRequest(
  bodyRules?: ValidationRules,
  queryRules?: ValidationRules,
  paramRules?: ValidationRules,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    // Validate body
    if (bodyRules) {
      Object.entries(bodyRules).forEach(([field, rules]) => {
        const value = req.body[field];
        const fieldErrors: string[] = [];

        rules.forEach((rule: ValidationRule) => {
          if (!rule.validate(value)) {
            fieldErrors.push(rule.message);
          }
        });

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
    }

    // Validate query
    if (queryRules) {
      Object.entries(queryRules).forEach(([field, rules]) => {
        const value = req.query[field];
        const fieldErrors: string[] = [];

        rules.forEach((rule: ValidationRule) => {
          if (!rule.validate(value)) {
            fieldErrors.push(rule.message);
          }
        });

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
    }

    // Validate params
    if (paramRules) {
      Object.entries(paramRules).forEach(([field, rules]) => {
        const value = req.params[field];
        const fieldErrors: string[] = [];

        rules.forEach((rule: ValidationRule) => {
          if (!rule.validate(value)) {
            fieldErrors.push(rule.message);
          }
        });

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Request validation failed', errors);
    }

    next();
  };
}
