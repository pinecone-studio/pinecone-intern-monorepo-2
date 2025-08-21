import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Types } from 'mongoose';
import { updateEmergencyContact } from 'src/resolvers/mutations';
import { EmergencyContactModel } from 'src/models';

jest.mock('src/models', () => ({
  EmergencyContactModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockEmergencyContactModel = EmergencyContactModel as jest.Mocked<typeof EmergencyContactModel>;

describe('updateEmergencyContact', () => {
  const mockInfo = {} as GraphQLResolveInfo;
  const mockEmergencyContactId = new Types.ObjectId().toString();
  const mockUserId = new Types.ObjectId();

  const mockEmergencyContactDoc = {
    _id: new Types.ObjectId(mockEmergencyContactId),
    userId: mockUserId,
    name: 'Updated John Doe',
    phone: '+1234567890',
    relationship: 'Brother',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-01'),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw NOT_FOUND when emergency contact does not exist', async () => {
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { phone: '123' } }, {}, mockInfo)
    ).rejects.toThrow('Emergency contact not found');
  });

  it('should update emergency contact with given input', async () => {
    const input = { name: 'Updated John Doe', phone: '+1234567890', relationship: 'Brother' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, {}, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Updated John Doe');
  });

  const fields = ['name', 'phone', 'relationship'] as const;

  it.each(fields)('should update emergency contact when %s is defined', async (field) => {
    const input = { [field]: 'Test Value' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, {}, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });

  it('should not include undefined fields in updateData', async () => {
    const input = { name: 'John' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, {}, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
  });

  it('should handle empty input gracefully', async () => {
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input: {} }, {}, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, {}, { new: true });
    expect(result.success).toBe(true);
  });

  it('should throw INTERNAL_SERVER_ERROR on database error', async () => {
    const dbError = new Error('DB fail');
    mockEmergencyContactModel.findByIdAndUpdate.mockRejectedValue(dbError);

    await expect(
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test' } }, {}, mockInfo)
    ).rejects.toThrow('Failed to update emergency contact');

    expect(console.error).toHaveBeenCalledWith('Failed to update emergency contact:', dbError);
  });

  it('should correctly format response data', async () => {
    const mockDocWithIds = {
      ...mockEmergencyContactDoc,
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      userId: new Types.ObjectId('507f1f77bcf86cd799439012'),
      toObject: jest.fn().mockReturnValue({
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        userId: new Types.ObjectId('507f1f77bcf86cd799439012'),
        name: 'Test User',
        phone: '+1234567890',
        relationship: 'Friend',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-12-01'),
      }),
    };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockDocWithIds);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test User' } }, {}, mockInfo);

    expect(result.data).toEqual({
      id: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      name: 'Test User',
      phone: '+1234567890',
      relationship: 'Friend',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-12-01'),
    });
  });

  it('should rethrow GraphQLError when encountered', async () => {
    const graphqlError = new GraphQLError('Custom GraphQL Error');
    mockEmergencyContactModel.findByIdAndUpdate.mockRejectedValue(graphqlError);

    await expect(
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test' } }, {}, mockInfo)
    ).rejects.toThrow('Custom GraphQL Error');

    expect(console.error).toHaveBeenCalledWith('Failed to update emergency contact:', graphqlError);
  });
});