import { logger } from './logger';

export const logAndThrowError = (message: string, error?: Error) => {
  logger.error(message);
  if (error) {
    logger.error(error.message);
    throw error;
  } else {
    throw new Error(message);
  }
};
