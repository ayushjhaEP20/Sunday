import app from './app';
import { config } from './config';

/**
 * Minimal Event Service server entry point.
 * Starts Express on the configured port.
 */
const server = app.listen(config.port, () => {
  console.log(`Event Service running on port ${config.port}`);
});

export default server;