import { logger } from './logger';

export const handleApiError = (operation: string, error) => {
  logger.error(`Error during ${operation}: ${error.message}`);
  throw error;
};
