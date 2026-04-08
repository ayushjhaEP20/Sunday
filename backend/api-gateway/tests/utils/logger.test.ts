/**
 * Example Unit Test
 * Demonstrates testing patterns using Jest and TypeScript
 */

import { Logger } from '../utils/logger';

describe('Logger', () => {
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should log info messages', () => {
      const logger = new Logger('test-service');
      logger.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const output = consoleInfoSpy.mock.calls[0][0] as string;
      expect(output).toContain('test-service');
      expect(output).toContain('INFO');
      expect(output).toContain('Test message');
    });

    it('should include metadata in log output', () => {
      const logger = new Logger('test-service');
      logger.info('Test message', { userId: '123', action: 'login' });

      expect(consoleInfoSpy).toHaveBeenCalled();
      const output = consoleInfoSpy.mock.calls[0][0] as string;
      expect(output).toContain('userId');
      expect(output).toContain('action');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const logger = new Logger('test-service');
      logger.error('Error occurred', { code: 'ERR_001' });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0] as string;
      expect(output).toContain('ERROR');
      expect(output).toContain('Error occurred');
    });

    it('should handle Error objects', () => {
      const logger = new Logger('test-service');
      const error = new Error('Test error');
      logger.error('Something failed', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
