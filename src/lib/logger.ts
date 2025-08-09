import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL,
  base: { env: process.env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
