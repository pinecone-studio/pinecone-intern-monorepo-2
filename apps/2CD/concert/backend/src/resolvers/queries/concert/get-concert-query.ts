/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Types } from 'mongoose';
import { QueryResolvers } from 'src/generated';
import { concertModel } from 'src/models';
function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function convertId(value: any): string {
  return typeof value?.toString === 'function' ? value.toString() : String(value);
}
function isSkippableField(key: string): boolean {
  return key === '__v';
}
function handleSpecialField(key: string, value: any): [string, any] | null {
  if (key === '_id') return ['id', convertId(value)];
  if (value instanceof Date) return [key, value.toISOString()];
  return null;
}
function convertObject(obj: Record<string, any>): Record<string, any> {
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
function convertArray(arr: any[]): any[] {
  return arr.map(convertIdFields);
}
function convertIdFields(input: any): any {
  if (Array.isArray(input)) return convertArray(input);
  if (isObject(input)) return convertObject(input);
  return input;
}
export const getConcert: QueryResolvers['getConcert'] = async (_, { input }) => {
  const filter = buildConcertFilter(input);
  const match = buildScheduleMatch(input?.date);
  const data = await concertModel.find(filter).populate('artists').populate('ticket').populate('venue').populate({ path: 'schedule', match }).lean();
  const filtered = data.filter((concert) => concert.schedule?.length > 0);
  return convertIdFields(filtered);
};

function buildConcertFilter(input: any): Record<string, any> {
  const filter: Record<string, any> = {};
  if (input?.title) {
    filter.title = { $regex: input.title, $options: 'i' };
  }
  if (input?.artist?.length) {
    filter.artists = {
      $in: input.artist.map((id: string) => new Types.ObjectId(id)),
    };
  }
  return filter;
}

function buildScheduleMatch(date?: string): Record<string, any> {
  if (!date) return {};
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  return { startDate: { $gte: start, $lt: end } };
}
