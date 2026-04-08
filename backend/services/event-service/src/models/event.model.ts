/**
 * Event Model Interface
 * Represents the shape of event data in the event-service.
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
