import { Router } from 'express';
import { getAllEvents } from '../controllers/event.controller';

/**
 * Event Routes
 * Base path: /api/events
 */
const router = Router();

router.get('/', getAllEvents);

export default router;
