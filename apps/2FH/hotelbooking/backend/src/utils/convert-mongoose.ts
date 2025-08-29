/**
 * Safely converts Mongoose documents to plain objects
 * This handles both Mongoose documents (which have .toObject()) and plain objects (for testing)
 */

// Helper function to check if object has toObject method
const hasToObjectMethod = (obj: Record<string, unknown>): boolean => {
  return typeof obj.toObject === 'function';
};

// Helper function to convert document to plain object
const convertDocumentToPlain = <T>(docObj: Record<string, unknown>): T => {
  return (docObj.toObject as () => unknown)() as T;
};

export const convertMongooseToPlain = <T>(doc: T): T => {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }
  
  const docObj = doc as Record<string, unknown>;
  if (hasToObjectMethod(docObj)) {
    return convertDocumentToPlain<T>(docObj);
  }
  
  return doc;
};

/**
 * Safely converts an array of Mongoose documents to plain objects
 */
export const convertMongooseArrayToPlain = <T>(docs: T[]): T[] => {
  return docs.map(doc => convertMongooseToPlain(doc));
};

