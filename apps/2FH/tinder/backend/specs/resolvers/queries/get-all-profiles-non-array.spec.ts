import { Types } from 'mongoose';
import { getAllProfiles, processGetAllProfilesRequest } from '../../../src/resolvers/queries/get-all-profiles';
import { Profile, Gender } from '../../../src/models/profile-model';

jest.mock('../../../src/models/profile-model', () => ({
    Profile: { find: jest.fn() },
    Gender: { MALE: 'male', FEMALE: 'female', BOTH: 'both' },
}));

const mockFind = Profile.find as jest.Mock;

// Mock the processGetAllProfilesRequest function
jest.spyOn(require('../../../src/resolvers/queries/get-all-profiles'), 'processGetAllProfilesRequest');

describe('getAllProfiles Non-Array Return Tests', () => {
    beforeEach(() => {
        mockFind.mockReset();
        jest.clearAllMocks();
    });

    it('handles non-array return from processGetAllProfilesRequest', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        // Mock processGetAllProfilesRequest to return a non-array value
        const nonArrayValue = { profiles: 'not an array' };
        (processGetAllProfilesRequest as jest.Mock).mockResolvedValue(nonArrayValue);

        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any);

        expect(result).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('processGetAllProfilesRequest returned non-array:', nonArrayValue);

        consoleSpy.mockRestore();
    });

    it('handles null return from processGetAllProfilesRequest', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        // Mock processGetAllProfilesRequest to return null
        (processGetAllProfilesRequest as jest.Mock).mockResolvedValue(null);

        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any);

        expect(result).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('processGetAllProfilesRequest returned non-array:', null);

        consoleSpy.mockRestore();
    });

    it('handles undefined return from processGetAllProfilesRequest', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        // Mock processGetAllProfilesRequest to return undefined
        (processGetAllProfilesRequest as jest.Mock).mockResolvedValue(undefined);

        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any);

        expect(result).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('processGetAllProfilesRequest returned non-array:', undefined);

        consoleSpy.mockRestore();
    });

    it('handles string return from processGetAllProfilesRequest', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        // Mock processGetAllProfilesRequest to return a string
        const stringValue = 'not an array';
        (processGetAllProfilesRequest as jest.Mock).mockResolvedValue(stringValue);

        const result = await (getAllProfiles as any)({}, {}, {} as any, {} as any);

        expect(result).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('processGetAllProfilesRequest returned non-array:', stringValue);

        consoleSpy.mockRestore();
    });
});