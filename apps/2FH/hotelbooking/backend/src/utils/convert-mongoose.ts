import { Document, Types } from 'mongoose';

/**
 * Converts a Mongoose document to a plain JavaScript object
 * @param doc - The Mongoose document to convert
 * @returns A plain JavaScript object
 */
export const convertMongooseToPlain = <T>(doc: Document<T>): T => {
  if (!doc) return doc;
  
  const plain = doc.toObject();
  
  // Convert ObjectIds to strings
  Object.keys(plain).forEach(key => {
    if (plain[key] instanceof Types.ObjectId) {
      plain[key] = plain[key].toString();
    }
  });
  
  return plain;
};

/**
 * Converts an array of Mongoose documents to plain JavaScript objects
 * @param docs - Array of Mongoose documents to convert
 * @returns Array of plain JavaScript objects
 */
export const convertMongooseArrayToPlain = <T>(docs: Document<T>[]): T[] => {
  if (!Array.isArray(docs)) return [];
  
  return docs.map(doc => convertMongooseToPlain(doc));
};

/**
 * Converts a single Mongoose document or null to a plain object or null
 * @param doc - The Mongoose document or null to convert
 * @returns A plain JavaScript object or null
 */
export const convertMongooseToPlainOrNull = <T>(doc: Document<T> | null): T | null => {
  if (!doc) return null;
  return convertMongooseToPlain(doc);
};




