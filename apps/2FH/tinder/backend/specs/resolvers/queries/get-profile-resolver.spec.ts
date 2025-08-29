import { Types } from 'mongoose';
import { getProfile } from '../../../src/resolvers/queries/get-profile';
import { ProfileModel } from '../../../src/models/profile-model';
import { parseDateOfBirth } from '../../../src/resolvers/queries/get-profile';

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

describe('Get Profile Query Resolver', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('parseDateOfBirth Edge Cases', () => {
        it('tests edge case with very long string', () => {
            const longString = 'a'.repeat(10000);
            const result = parseDateOfBirth(longString);
            expect(result).toBe('');
        });
        it('tests edge case with special characters', () => {
            const specialString = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const result = parseDateOfBirth(specialString);
            expect(result).toBe('');
        });
        it('tests edge case with unicode characters', () => {
            const unicodeString = '🚀🌟💫✨';
            const result = parseDateOfBirth(unicodeString);
            expect(result).toBe('');
        });
        it('tests edge case with numbers that are not dates', () => {
            const numberString = '123456789';
            const result = parseDateOfBirth(numberString);
            expect(result).toBe('');
        });
        it('tests catch block execution by mocking Date constructor temporarily', () => {
            // Save original Date constructor
            const OriginalDate = global.Date;

            // Create a mock Date that throws an error for specific input
            let callCount = 0;
            const MockDate = function (this: any, input?: any) {
                callCount++;
                // Only throw on the second call to avoid breaking other tests
                if (callCount === 2) {
                    throw new Error('Mocked Date error');
                }
                return new OriginalDate(input);
            } as any;

            // Copy static methods
            MockDate.now = OriginalDate.now;
            MockDate.UTC = OriginalDate.UTC;
            MockDate.parse = OriginalDate.parse;

            // Replace global Date temporarily
            global.Date = MockDate;

            try {
                // First call should work normally
                const result1 = parseDateOfBirth('1990-01-01');
                expect(result1).toBe('1990-01-01T00:00:00.000Z');

                // Second call should trigger catch block
                const result2 = parseDateOfBirth('1990-01-02');
                expect(result2).toBe('');
            } finally {
                // Always restore original Date constructor
                global.Date = OriginalDate;
            }
        });
    });

    describe('getProfile Resolver', () => {
        it('returns profile successfully', async () => {
            const mockLikedProfile = { ...mockProfile, _id: new Types.ObjectId() };
            const mockMatchedProfile = { ...mockProfile, _id: new Types.ObjectId() };

            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockProfile);
            (ProfileModel.find as jest.Mock)
                .mockResolvedValueOnce([mockLikedProfile])
                .mockResolvedValueOnce([mockMatchedProfile]);

            const result = await (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockProfileId);
            expect(result.userId).toBe(mockUserId);
            expect(result.name).toBe('Test User');
            expect(result.gender).toBe('male');
            expect(result.bio).toBe('Test bio');
            expect(result.interests).toEqual(['coding', 'music']);
            expect(result.profession).toBe('Developer');
            expect(result.work).toBe('Tech Company');
            expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
            expect(result.dateOfBirth).toBe('1990-01-01T00:00:00.000Z');
            expect(result.likes).toHaveLength(1);
            expect(result.matches).toHaveLength(1);
        });

        it('returns profile with fallback values for null fields', async () => {
            const profileWithNulls = {
                ...mockProfile,
                bio: null,
                interests: null,
                profession: null,
                work: null,
                images: null,
                dateOfBirth: null,
            };

            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(profileWithNulls);
            (ProfileModel.find as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

            const result = await (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any);

            expect(result.bio).toBe('');
            expect(result.interests).toEqual([]);
            expect(result.profession).toBe('');
            expect(result.work).toBe('');
            expect(result.images).toEqual([]);
            expect(result.dateOfBirth).toBe('');
        });

        it('throws invalid userId error', async () => {
            await expect(
                (getProfile as any)({}, { userId: 'invalid-id' }, {} as any, {} as any)
            ).rejects.toThrow('Invalid userId format');
        });

        it('handles database error during profile fetch', async () => {
            (ProfileModel.findOne as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));

            await expect(
                (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any)
            ).rejects.toThrow('Database error');
        });

        it('handles database error during likes/matches fetch', async () => {
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockProfile);
            (ProfileModel.find as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));

            await expect(
                (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any)
            ).rejects.toThrow('Database error');
        });

        it('handles generic error during profile fetch', async () => {
            (ProfileModel.findOne as jest.Mock).mockRejectedValueOnce(new Error('Generic error'));

            await expect(
                (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any)
            ).rejects.toThrow('Failed to fetch profile');
        });

        it('handles non-Error object during profile fetch', async () => {
            (ProfileModel.findOne as jest.Mock).mockRejectedValueOnce('String error');

            await expect(
                (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any)
            ).rejects.toThrow('Failed to fetch profile');
        });

        it('handles error in safeDateToISOString with invalid date', async () => {
            const profileWithInvalidDate = {
                ...mockProfile,
                createdAt: 'invalid-date',
                updatedAt: 'invalid-date',
            };

            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(profileWithInvalidDate);
            (ProfileModel.find as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

            const result = await (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any);
            expect(result).toBeDefined();
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
        });

        it('handles error in safeDateToISOString with other types', async () => {
            const profileWithOtherTypes = {
                ...mockProfile,
                createdAt: 123 as any,
                updatedAt: true as any,
            };

            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(profileWithOtherTypes);
            (ProfileModel.find as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

            const result = await (getProfile as any)({}, { userId: mockUserId }, {} as any, {} as any);
            expect(result).toBeDefined();
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
        });










    });
}); 