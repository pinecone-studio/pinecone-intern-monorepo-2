import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { getAllProfiles, mapGenderToGraphQL, parseDateOfBirth, parseStringDate, safeDateToISOString, formatBasicProfile } from '../../../src/resolvers/queries/get-all-profiles';
import { Profile, Gender } from '../../../src/models/profile-model';
import { Gender as GraphQLGender } from '../../../src/generated';

jest.mock('../../../src/models/profile-model', () => ({
    Profile: { find: jest.fn() },
    Gender: { MALE: 'male', FEMALE: 'female', BOTH: 'both' },
}));

const mockFind = Profile.find as jest.Mock;

describe('getAllProfiles Main Tests', () => {
    beforeEach(() => mockFind.mockReset());

    it('maps genders correctly', () => {
        expect(mapGenderToGraphQL(Gender.MALE)).toBe(GraphQLGender.Male);
        expect(mapGenderToGraphQL(Gender.FEMALE)).toBe(GraphQLGender.Female);
        expect(mapGenderToGraphQL(Gender.BOTH)).toBe(GraphQLGender.Both);
        expect(mapGenderToGraphQL('UNKNOWN' as Gender)).toBe(GraphQLGender.Male);
    });
    it('handles invalid gender values', () => {
        expect(mapGenderToGraphQL('invalid' as Gender)).toBe(GraphQLGender.Male);
        expect(mapGenderToGraphQL('OTHER' as Gender)).toBe(GraphQLGender.Male);
        expect(mapGenderToGraphQL('' as Gender)).toBe(GraphQLGender.Male);
    });
    it('parses dateOfBirth correctly', () => {
        expect(parseDateOfBirth('2000-01-01')).toMatch(/2000-01-01T/);
        expect(parseDateOfBirth('invalid')).toBe('');
        expect(parseDateOfBirth(null)).toBe('');
        expect(parseDateOfBirth(undefined)).toBe('');
        const original = Date;
        global.Date = jest.fn(() => { throw new Error(); }) as any;
        expect(parseDateOfBirth('2000-01-01')).toBe('');
        global.Date = original;
    });
    it('parses string dates correctly', () => {
        expect(parseStringDate('2020-01-01')).toMatch(/2020-01-01T/);
        expect(parseStringDate('invalid')).toMatch(/T/);
        let calls = 0;
        const original = Date;
        global.Date = jest.fn((input) => {
            calls++;
            if (calls === 1 && input) throw new Error();
            return new original(input);
        }) as any;
        (global.Date as any).now = original.now;
        Object.setPrototypeOf(global.Date, original);
        expect(parseStringDate('test')).toMatch(/T/);
        global.Date = original;
    });
    it('handles safeDateToISOString', () => {
        expect(safeDateToISOString(new Date('2020-01-01'))).toMatch(/2020-01-01T/);
        expect(safeDateToISOString('2020-01-01')).toMatch(/2020-01-01T/);
        expect(safeDateToISOString(null)).toMatch(/T/);
        expect(safeDateToISOString(undefined)).toMatch(/T/);
        expect(safeDateToISOString(123 as any)).toMatch(/T/);
    });
    it('formats basic profile', () => {
        const id = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const profile = { _id: id, userId: userId, name: 'Test', gender: Gender.MALE, bio: 'Bio', interests: ['coding'] };
        const result = formatBasicProfile(profile as any);
        expect(result.id).toBe(id.toHexString());
        expect(result.userId).toBe(userId.toHexString());
        expect(result.name).toBe('Test');
        expect(result.gender).toBe(GraphQLGender.Male);
        expect(result.bio).toBe('Bio');
        expect(result.interests).toEqual(['coding']);
    });
    it('handles missing profile fields', () => {
        const profile = { _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: null, gender: Gender.FEMALE, bio: null, interests: null };
        const result = formatBasicProfile(profile as any);
        expect(result.name).toBe('');
        expect(result.bio).toBe('');
        expect(result.interests).toEqual([]);
    });
    it('handles null _id and userId', () => {
        const profile = { _id: null, userId: null, name: 'Test', gender: Gender.MALE, bio: 'Bio', interests: ['coding'] };
        const result = formatBasicProfile(profile as any);
        expect(result.id).toBe('');
        expect(result.userId).toBe('');
        expect(result.name).toBe('Test');
        expect(result.gender).toBe(GraphQLGender.Male);
        expect(result.bio).toBe('Bio');
        expect(result.interests).toEqual(['coding']);
    });
    it('handles undefined _id and userId', () => {
        const profile = { _id: undefined, userId: undefined, name: 'Test', gender: Gender.MALE, bio: 'Bio', interests: ['coding'] };
        const result = formatBasicProfile(profile as any);
        expect(result.id).toBe('');
        expect(result.userId).toBe('');
        expect(result.name).toBe('Test');
        expect(result.gender).toBe(GraphQLGender.Male);
        expect(result.bio).toBe('Bio');
        expect(result.interests).toEqual(['coding']);
    });

    it('handles invalid gender in formatBasicProfile', () => {
        const profile = { _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: 'Test', gender: 'invalid' as Gender, bio: 'Bio', interests: ['coding'] };
        const result = formatBasicProfile(profile as any);
        expect(result.gender).toBe(GraphQLGender.Male);
    });
    it('returns profiles successfully', async () => {
        const profile = {
            _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: 'John', gender: Gender.MALE, bio: 'Developer',
            interests: ['coding', 'music'], profession: 'Software Engineer', work: 'Tech Company', images: ['image1.jpg'],
            dateOfBirth: '1990-01-01', createdAt: new Date('2020-01-01'), updatedAt: new Date('2020-01-02')
        };
        mockFind.mockResolvedValue([profile]);
        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any) as any;
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('John');
        expect(result[0].profession).toBe('Software Engineer');
        expect(result[0].likes).toEqual([]);
        expect(result[0].matches).toEqual([]);
    });
    it('handles empty profile list', async () => {
        mockFind.mockResolvedValue([]);
        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any) as any;
        expect(result).toEqual([]);
    });
    it('handles profile with missing work fields', async () => {
        const profile = {
            _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: 'Jane', gender: Gender.FEMALE, bio: '',
            interests: [], profession: '', work: '', images: [], dateOfBirth: '', createdAt: null, updatedAt: undefined
        };
        mockFind.mockResolvedValue([profile]);
        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any) as any;
        expect(result[0].profession).toBe('');
        expect(result[0].work).toBe('');
        expect(result[0].images).toEqual([]);
        expect(result[0].dateOfBirth).toBe('');
        expect(result[0].createdAt).toMatch(/T/);
        expect(result[0].updatedAt).toMatch(/T/);
    });
    it('handles GraphQL errors', async () => {
        const error = new GraphQLError('Test error');
        mockFind.mockRejectedValue(error);
        await expect((getAllProfiles as any)({}, {}, {} as any, {} as any)).rejects.toThrow('Test error');
    });
    it('handles database errors', async () => {
        mockFind.mockRejectedValue(new Error('Database connection failed'));
        await expect((getAllProfiles as any)({}, {}, {} as any, {} as any)).rejects.toThrow('Database error');
    });
    it('handles connection errors', async () => {
        mockFind.mockRejectedValue(new Error('connection timeout'));
        await expect((getAllProfiles as any)({}, {}, {} as any, {} as any)).rejects.toThrow('Database error');
    });
    it('handles generic errors', async () => {
        mockFind.mockRejectedValue(new Error('Something went wrong'));
        await expect((getAllProfiles as any)({}, {}, {} as any, {} as any)).rejects.toThrow('Failed to fetch profiles');
    });
    it('handles non-Error objects', async () => {
        mockFind.mockRejectedValue('string error');
        await expect((getAllProfiles as any)({}, {}, {} as any, {} as any)).rejects.toThrow('Failed to fetch profiles');
    });
});