describe('logger', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('defaults to debug level outside production', () => {
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;

    const { logger } = require('./logger');

    expect(logger.level).toBe('debug');
  });

  it('defaults to info level in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.LOG_LEVEL;

    const { logger } = require('./logger');

    expect(logger.level).toBe('info');
  });

  it('respects an explicit LOG_LEVEL override', () => {
    process.env.LOG_LEVEL = 'warn';

    const { logger } = require('./logger');

    expect(logger.level).toBe('warn');
  });
});
