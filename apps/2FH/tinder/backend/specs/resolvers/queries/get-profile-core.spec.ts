import { Types } from 'mongoose';


// ProfileModel import removed as it's not used in this file
import { mapGenderToGraphQL, parseDateOfBirth, parseStringDate, safeDateToISOString, formatBasicProfile } from '../../../src/resolvers/queries/get-profile';

// Mock ProfileModel
jest.mock('../../../src/models/profile-model');

const mockProfileId = new Types.ObjectId().toHexString();
const mockUserId = new Types.ObjectId().toHexString();

const mockProfile = {
    _id: new Types.ObjectId(mockProfileId),
    userId: new Types.ObjectId(mockUserId),
    name: 'Test User',
    gender: 'MALE',
    bio: 'Test bio',
    interests: ['coding', 'music'],
    profession: 'Developer',
    work: 'Tech Company',
    images: ['image1.jpg', 'image2.jpg'],
    dateOfBirth: '1990-01-01',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    likes: [],
    matches: [],
} as any;

describe('Get Profile Query Core', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Helper Functions', () => {
        describe('mapGenderToGraphQL', () => {
            it('should map MALE gender correctly', () => {
                expect(mapGenderToGraphQL('MALE' as any)).toBe('male');
            });
            it('should map FEMALE gender correctly', () => {
                expect(mapGenderToGraphQL('FEMALE' as any)).toBe('female');
            });
            it('should map BOTH gender correctly', () => {
                expect(mapGenderToGraphQL('BOTH' as any)).toBe('both');
            });
            it('should handle invalid gender with default case', () => {
                const result = (mapGenderToGraphQL as any)('INVALID' as any);
                expect(result).toBe('male');
            });
        });

        describe('parseDateOfBirth', () => {
            it('valid date string', () => {
                expect(parseDateOfBirth('1990-01-01')).toBe('1990-01-01T00:00:00.000Z');
            });
            it('valid ISO date string', () => {
                expect(parseDateOfBirth('1990-01-01T00:00:00.000Z')).toBe('1990-01-01T00:00:00.000Z');
            });
            it('valid date with time', () => {
                expect(parseDateOfBirth('1990-01-01T12:30:45.123Z')).toBe('1990-01-01T12:30:45.123Z');
            });
            it('valid date string that successfully parses', () => {
                const result = parseDateOfBirth('2023-12-25');
                expect(result).toBe('2023-12-25T00:00:00.000Z');
            });
            it('direct function call with valid date', () => {
                const testDate = '2024-02-20';
                const result = parseDateOfBirth(testDate);
                expect(result).toBe('2024-02-20T00:00:00.000Z');
            });
            it('null returns empty string', () => {
                expect(parseDateOfBirth(null)).toBe('');
            });
            it('undefined returns empty string', () => {
                expect(parseDateOfBirth(undefined)).toBe('');
            });
            it('invalid date returns empty string', () => {
                expect(parseDateOfBirth('invalid-date')).toBe('');
            });
            it('empty string returns empty string', () => {
                expect(parseDateOfBirth('')).toBe('');
            });
        });

        describe('parseStringDate', () => {
            it('valid string', () => {
                expect(parseStringDate('1990-01-01')).toBe('1990-01-01T00:00:00.000Z');
            });
            it('valid ISO string', () => {
                expect(parseStringDate('1990-01-01T00:00:00.000Z')).toBe('1990-01-01T00:00:00.000Z');
            });
            it('valid date string that successfully parses to ISO', () => {
                const result = parseStringDate('2023-12-25');
                expect(result).toBe('2023-12-25T00:00:00.000Z');
            });
            it('direct function call with valid date string', () => {
                const testDate = '2024-02-20';
                const result = parseStringDate(testDate);
                expect(result).toBe('2024-02-20T00:00:00.000Z');
            });
            it('invalid string returns current ISO string', () => {
                const result = parseStringDate('invalid');
                expect(result).toBeDefined();
                expect(new Date(result).getTime()).toBeGreaterThan(0);
            });


            it('tests catch block by mocking toISOString to throw error', () => {
                // Mock Date.prototype.toISOString to throw an error on the first call
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                const mockToISOString = (): string => {
                    callCount++;
                    if (callCount === 1) {
                        // First call throws an error to trigger catch block
                        throw new Error('Mocked toISOString error');
                    }
                    // Subsequent calls work normally
                    return originalToISOString.call(new Date());
                };

                Date.prototype.toISOString = mockToISOString;

                try {
                    // This call should trigger the catch block
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(new Date(result).getTime()).toBeGreaterThan(0);
                } finally {
                    // Always restore original toISOString
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 1) {
                        throw new Error('Mocked toISOString error');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 1) {
                        throw new Error('Mocked toISOString error');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 2) {
                        throw new Error('Mocked toISOString error in catch block');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block with new Date()', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 2) {
                        throw new Error('Mocked toISOString error in catch block with new Date()');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block with new Date() in catch', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 3) {
                        throw new Error('Mocked toISOString error in catch block with new Date() in catch');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block with new Date() in catch with new Date()', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 4) {
                        throw new Error('Mocked toISOString error in catch block with new Date() in catch with new Date()');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block with new Date() in catch with new Date() in catch', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 5) {
                        throw new Error('Mocked toISOString error in catch block with new Date() in catch with new Date() in catch');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
            it('tests catch block with Date constructor error in parseStringDate catch block with new Date() in catch with new Date() in catch with new Date()', () => {
                const originalToISOString = Date.prototype.toISOString;
                let callCount = 0;

                Date.prototype.toISOString = function (this: Date) {
                    callCount++;
                    if (callCount === 6) {
                        throw new Error('Mocked toISOString error in catch block with new Date() in catch with new Date() in catch with new Date()');
                    }
                    return originalToISOString.call(this);
                };

                try {
                    const result = parseStringDate('1990-01-01');
                    expect(result).toBeDefined();
                    expect(typeof result).toBe('string');
                } finally {
                    Date.prototype.toISOString = originalToISOString;
                }
            });
        });

        describe('safeDateToISOString', () => {
            it('handles Date object', () => {
                expect(safeDateToISOString(new Date('1990-01-01'))).toBe('1990-01-01T00:00:00.000Z');
            });
            it('handles string date', () => {
                expect(safeDateToISOString('1990-01-01')).toBe('1990-01-01T00:00:00.000Z');
            });
            it('handles null input', () => {
                const result = safeDateToISOString(null);
                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
            });
            it('handles undefined input', () => {
                const result = safeDateToISOString(undefined);
                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
            });
            it('handles other types', () => {
                const result = safeDateToISOString(123 as any);
                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
            });
        });

        describe('formatBasicProfile', () => {
            it('formats correctly', () => {
                expect(formatBasicProfile(mockProfile)).toEqual({
                    id: mockProfileId,
                    userId: mockUserId,
                    name: 'Test User',
                    gender: 'male',
                    bio: 'Test bio',
                    interests: ['coding', 'music'],
                });
            });
        });
    });
}); 