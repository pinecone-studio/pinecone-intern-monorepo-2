/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function convertId(value: any): string {
  return typeof value?.toString === 'function' ? value.toString() : String(value);
}
export function isSkippableField(key: string): boolean {
  return key === '__v';
}
export function handleSpecialField(key: string, value: any): [string, any] | null {
  if (key === '_id') return ['id', convertId(value)];
  if (value instanceof Date) return [key, value.toISOString()];
  return null;
}
export function convertObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (isSkippableField(key)) continue;

    const special = handleSpecialField(key, obj[key]);
    if (special) {
      const [newKey, newValue] = special;
      result[newKey] = newValue;
    } else {
      result[key] = convertIdFields(obj[key]);
    }
  }
  return result;
}
export function convertArray(arr: any[]): any[] {
  return arr.map(convertIdFields);
}
export function convertIdFields(input: any): any {
  if (Array.isArray(input)) return convertArray(input);
  if (isObject(input)) return convertObject(input);
  return input;
}

export function buildConcertFilter(input: any): Record<string, any> {
  const filter: Record<string, any> = {};
  if (input?.title) {
    filter.title = { $regex: input.title, $options: 'i' };
  }
  if (input?.artist?.length) {
    filter.artists = {
      $all: input.artist.map((id: string) => new Types.ObjectId(id)),
    };
  }
  return filter;
}

export function buildScheduleMatch(date?: string): Record<string, any> {
  if (!date) return {};
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  return { startDate: { $gte: start, $lt: end } };
}
