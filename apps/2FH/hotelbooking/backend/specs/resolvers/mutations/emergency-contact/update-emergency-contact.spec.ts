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
  
  // Create a mock Request object
  const mockRequest = {
    cache: 'default' as RequestCache,
    credentials: 'same-origin' as RequestCredentials,
    destination: '' as RequestDestination,
    headers: new Headers(),
    integrity: '',
    keepalive: false,
    method: 'GET',
    mode: 'cors' as RequestMode,
    redirect: 'follow' as RequestRedirect,
    referrer: '',
    referrerPolicy: 'no-referrer' as ReferrerPolicy,
    signal: null as AbortSignal | null,
    url: 'http://localhost:3000',
    body: null,
    bodyUsed: false,
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: jest.fn(),
    text: jest.fn(),
  } as Request;

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
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { phone: '123' } }, { req: mockRequest, dbConnected: true }, mockInfo)
    ).rejects.toThrow('Emergency contact not found');
  });

  it('should update emergency contact with given input', async () => {
    const input = { name: 'Updated John Doe', phone: '+1234567890', relationship: 'Brother' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Updated John Doe');
  });

  const fields = ['name', 'phone', 'relationship'] as const;

  it.each(fields)('should update emergency contact when %s is defined', async (field) => {
    const input = { [field]: 'Test Value' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });

  it('should not include undefined fields in updateData', async () => {
    const input = { name: 'John' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
  });

  it('should handle empty input gracefully', async () => {
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input: {} }, { req: mockRequest, dbConnected: true }, mockInfo);

    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, {}, { new: true });
    expect(result.success).toBe(true);
  });

  it('should throw INTERNAL_SERVER_ERROR on database error', async () => {
    const dbError = new Error('DB fail');
    mockEmergencyContactModel.findByIdAndUpdate.mockRejectedValue(dbError);

    await expect(
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test' } }, { req: mockRequest, dbConnected: true }, mockInfo)
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

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test User' } }, { req: mockRequest, dbConnected: true }, mockInfo);

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
      updateEmergencyContact({}, { id: mockEmergencyContactId, input: { name: 'Test' } }, { req: mockRequest, dbConnected: true }, mockInfo)
    ).rejects.toThrow('Custom GraphQL Error');

    expect(console.error).toHaveBeenCalledWith('Failed to update emergency contact:', graphqlError);
  });

  it('should handle input with undefined values correctly', async () => {
    const input = { name: 'Test', phone: undefined, relationship: undefined };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    // Should only pass defined values to the database
    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, { name: 'Test' }, { new: true });
    expect(result.success).toBe(true);
  });

  it('should handle input with null values correctly', async () => {
    const input = { name: 'Test', phone: null as any, relationship: null as any };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    // Should only pass defined values to the database (null values are considered defined by Object.fromEntries)
    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });

  it('should handle input with empty string values correctly', async () => {
    const input = { name: '', phone: '', relationship: '' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    // Empty strings should be included as they are defined values
    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });

  it('should handle input with zero values correctly', async () => {
    const input = { name: 'Test', phone: '0', relationship: '0' };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    // Zero values should be included as they are defined values
    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });

  it('should handle input with false values correctly', async () => {
    const input = { name: 'Test', phone: false as any, relationship: false as any };
    mockEmergencyContactModel.findByIdAndUpdate.mockResolvedValue(mockEmergencyContactDoc);

    const result = await updateEmergencyContact({}, { id: mockEmergencyContactId, input }, { req: mockRequest, dbConnected: true }, mockInfo);

    // False values should be included as they are defined values
    expect(mockEmergencyContactModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmergencyContactId, input, { new: true });
    expect(result.success).toBe(true);
  });
});