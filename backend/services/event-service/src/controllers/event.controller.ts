import { Request, Response } from 'express';
import { eventService } from '../services/event.service';

/**
 * Event Controller
 * Handles HTTP routing concerns for event-related endpoints.
 * Business logic is delegated to the service layer.
 */
export const getAllEvents = (req: Request, res: Response): void => {
  const result = eventService.getAllEvents();

  res.status(200).json(result);
};
