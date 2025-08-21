import { GraphQLError } from 'graphql';
import { EmergencyContactModel } from 'src/models';
import { createEmergencyContact } from 'src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  EmergencyContactModel: { create: jest.fn() }
}));

const mockEmergencyContactModel = EmergencyContactModel as jest.Mocked<typeof EmergencyContactModel>;

describe('createEmergencyContact', () => {
  const mockInput = {
    userId: '68a30057d6c96dbd1101aa11',
    name: 'John Doe',
    phone: '99883344',
    relationship: 'brother'
  };

  const mockCreatedDoc = {
    _id: '68a30057d6c96dbd1101dd16',
    userId: '68a30057d6c96dbd1101aa11',
    name: 'John Doe',
    phone: '99883344',
    relationship: 'brother',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  };

  const expectedTransformedDoc = {
    id: '68a30057d6c96dbd1101dd16',
    userId: '68a30057d6c96dbd1101aa11',
    name: 'John Doe',
    phone: '99883344',
    relationship: 'brother',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  };

  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it('1. should create emergency contact successfully', async () => {
    mockEmergencyContactModel.create.mockResolvedValue(mockCreatedDoc as any);
    const result = await (createEmergencyContact as any)({}, { input: mockInput }, {}, {});

    expect(mockEmergencyContactModel.create).toHaveBeenCalledWith(mockInput);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Emergency contact created successfully');
    expect(result.data).toEqual(expectedTransformedDoc);
  });

  it('2. should handle creation with ObjectId fields', async () => {
    const mockDocWithObjectId = {
      _id: { toString: () => '68a30057d6c96dbd1101dd16' },
      userId: { toString: () => '68a30057d6c96dbd1101aa11' },
      name: 'John Doe',
      phone: '99883344',
      relationship: 'brother',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z')
    };

    mockEmergencyContactModel.create.mockResolvedValue(mockDocWithObjectId as any);
    const result = await (createEmergencyContact as any)({}, { input: mockInput }, {}, {});

    expect(result.success).toBe(true);
    expect(result.data.id).toBe('68a30057d6c96dbd1101dd16');
    expect(result.data.userId).toBe('68a30057d6c96dbd1101aa11');
  });

  it('3. should handle document without timestamps', async () => {
    const mockDocWithoutTimestamps = {
      _id: '68a30057d6c96dbd1101dd16',
      userId: '68a30057d6c96dbd1101aa11',
      name: 'John Doe',
      phone: '99883344',
      relationship: 'brother'
    };

    mockEmergencyContactModel.create.mockResolvedValue(mockDocWithoutTimestamps as any);
    const result = await (createEmergencyContact as any)({}, { input: mockInput }, {}, {});

    expect(result.success).toBe(true);
  });

  it('4. should throw GraphQLError when database create fails', async () => {
    const dbError = new Error('Database connection failed');
    mockEmergencyContactModel.create.mockRejectedValue(dbError);

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(GraphQLError);
  });

  it('5. should throw GraphQLError when created document is null', async () => {
    mockEmergencyContactModel.create.mockResolvedValue(null as any);

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(GraphQLError);
  });

  it('6. should throw GraphQLError when created document has no _id', async () => {
    const mockDocWithoutId = { ...mockInput };
    mockEmergencyContactModel.create.mockResolvedValue(mockDocWithoutId as any);

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(GraphQLError);
  });

  it('7. should re-throw GraphQLError when it is already a GraphQLError', async () => {
    const graphQLError = new GraphQLError('Custom validation error', {
      extensions: { code: 'VALIDATION_ERROR', field: 'phone' }
    });

    mockEmergencyContactModel.create.mockRejectedValue(graphQLError);

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(graphQLError);
  });

  it('8. should handle non-Error objects thrown by database', async () => {
    mockEmergencyContactModel.create.mockRejectedValue('String error');

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(GraphQLError);
  });

  it('9. should validate input data structure', async () => {
    mockEmergencyContactModel.create.mockResolvedValue(mockCreatedDoc as any);
    await (createEmergencyContact as any)({}, { input: mockInput }, {}, {});

    expect(mockEmergencyContactModel.create).toHaveBeenCalledWith(mockInput);
  });

  it('10. should handle MongoDB validation errors', async () => {
    const mongoError = new Error('E11000 duplicate key error');
    mongoError.name = 'MongoError';
    (mongoError as any).code = 11000;

    mockEmergencyContactModel.create.mockRejectedValue(mongoError);

    await expect((createEmergencyContact as any)({}, { input: mockInput }, {}, {}))
      .rejects.toThrow(GraphQLError);
  });
});