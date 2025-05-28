import { Types } from "mongoose";
import { buildConcertFilter, buildScheduleMatch, convertId, convertIdFields, handleSpecialField, isObject, isSkippableField } from "src/utils/converid-fields";

describe('buildScheduleMatch', () => {
  it('should return match object if date is provided', () => {
    const match = buildScheduleMatch('2025-06-01');
    expect(match.startDate.$gte).toEqual(new Date('2025-06-01T00:00:00.000Z'));
    expect(match.startDate.$lt).toEqual(new Date('2025-06-01T23:59:59.999Z'));
  });

  it('should return empty object if no date is provided', () => {
    expect(buildScheduleMatch(undefined)).toEqual({});
  });
});

describe('buildConcertFilter', () => {
  it('should build filter with title and artist', () => {
    const artistId = new Types.ObjectId().toString();
    const filter = buildConcertFilter({ title: 'Pop', artist: [artistId] });
    expect(filter.title).toEqual({ $regex: 'Pop', $options: 'i' });
    expect(filter.artists).toEqual({ $in: [new Types.ObjectId(artistId)] });
  });

  it('should return empty filter if no input', () => {
    expect(buildConcertFilter(undefined)).toEqual({});
  });
});
describe('handleSpecialField', () => {
  it('should return null for non-special fields', () => {
    expect(handleSpecialField('name', 'value')).toBeNull();
  });
});
describe('isObject', () => {
  it('should return true for plain object', () => {
    expect(isObject({})).toBe(true);
  });

  it('should return false for array', () => {
    expect(isObject([])).toBe(false);
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });
});
describe('isSkippableField', () => {
  it('should return true for "__v"', () => {
    expect(isSkippableField('__v')).toBe(true);
  });

  it('should return false for other keys', () => {
    expect(isSkippableField('id')).toBe(false);
  });
});

describe('convertId', () => {
  it('should call toString if available', () => {
    const value = { toString: () => 'customId' };
    expect(convertId(value)).toBe('customId');
  });

  it('should fallback to String() if toString is not a function', () => {
    const value = 12345;
    expect(convertId(value)).toBe('12345');
  });
});

describe('convertIdFields', () => {
  it('should convert array input', () => {
    const input = [{ _id: '123' }];
    const result = convertIdFields(input);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should convert object input', () => {
    const input = { _id: '123', name: 'Test' };
    const result = convertIdFields(input);
    expect(result).toHaveProperty('id');
  });
  it('should return primitive input as is', () => {
    const input = 'hello';
    expect(convertIdFields(input)).toBe('hello');
  });
});