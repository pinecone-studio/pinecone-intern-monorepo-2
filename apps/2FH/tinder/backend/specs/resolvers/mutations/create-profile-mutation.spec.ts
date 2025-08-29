import { createProfile } from '../../../src/resolvers/mutations/create-profile-mutation';
import { ProfileModel, User } from '../../../src/models';
import { GraphQLError } from 'graphql';

jest.mock('../../../src/models', () => ({
    ProfileModel: {
        create: jest.fn(),
    },
    User: {
        findById: jest.fn(),
    },
}));

describe('createProfile mutation', () => {
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockUser = {
        _id: mockUserId,
        email: 'user@example.com',
    };
    const mockProfileData = {
        userId: mockUserId,
        name: 'John Doe',
        gender: 'Male' as any,
        bio: 'Hello world',
        interests: ['coding', 'music'],
        profession: 'Developer',
        work: 'Software Engineer',
        images: ['image1.jpg', 'image2.jpg'],
        dateOfBirth: '1990-01-01',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a profile successfully', async () => {
        // Arrange
        (User.findById as jest.Mock).mockResolvedValue(mockUser);
        (ProfileModel.create as jest.Mock).mockResolvedValue({});

        // Act
        const result = await createProfile!({}, { input: mockProfileData }, {} as any, {} as any);

        // Assert
        expect(result).toBeDefined();
        expect(ProfileModel.create).toHaveBeenCalledWith({
            ...mockProfileData,
            dateOfBirth: new Date('1990-01-01'),
        });
    });

    it('should throw error when user not found', async () => {
        // Arrange
        (User.findById as jest.Mock).mockResolvedValue(null);

        // Act & Assert
        await expect(createProfile!({}, { input: mockProfileData }, {} as any, {} as any))
            .rejects
            .toThrow(new GraphQLError('Cannot create profile: User with this userId does not exist'));
    });

    it('should throw error for invalid userId format', async () => {
        // Arrange
        const invalidInput = { ...mockProfileData, userId: 'invalid-id' };

        // Act & Assert
        await expect(createProfile!({}, { input: invalidInput }, {} as any, {} as any))
            .rejects
            .toThrow(new GraphQLError('Cannot create profile: input must be a 24 character hex string, 12 byte Uint8Array, or an integer'));
    });

    it('should throw error for invalid dateOfBirth', async () => {
        // Arrange
        const invalidInput = { ...mockProfileData, dateOfBirth: 'invalid-date' };

        // Mock User.findById to return a valid user so we can test dateOfBirth validation
        (User.findById as jest.Mock).mockResolvedValue(mockUser);

        // Act & Assert
        await expect(createProfile!({}, { input: invalidInput }, {} as any, {} as any))
            .rejects
            .toThrow(new GraphQLError('Cannot create profile: Invalid time value'));
    });
});
