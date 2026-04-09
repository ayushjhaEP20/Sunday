import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * Event Controller
 * Handles HTTP routing concerns for event-related endpoints.
 * Business logic is delegated to the service layer.
 */
export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  const result = await eventService.getAllEvents();

  res.status(200).json(result);
});