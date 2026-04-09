import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async Handler
 * Wraps async Express route handlers and forwards errors to next().
 * This keeps controllers clean and avoids repeated try/catch blocks.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
};
