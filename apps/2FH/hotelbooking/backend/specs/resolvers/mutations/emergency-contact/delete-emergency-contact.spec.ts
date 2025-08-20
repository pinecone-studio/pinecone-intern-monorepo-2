import { GraphQLError } from 'graphql';
import { EmergencyContactModel } from 'src/models';
import { deleteEmergencyContact } from 'src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  EmergencyContactModel: {
    findByIdAndDelete: jest.fn(),
  },
}));

const mockEmergencyContactModel = EmergencyContactModel as jest.Mocked<typeof EmergencyContactModel>;

describe('deleteEmergencyContact', () => {
  const validId = '68a30057d6c96dbd1101dd16';
  const nonExistentId = '68a30057d6c96dbd1101dd99';

  const mockDeletedContact = {
    _id: '68a30057d6c96dbd1101dd16',
    userId: '68a30057d6c96dbd1101aa11',
    name: 'John Doe',
    phone: '99883344',
    relationship: 'brother',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null); 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('1. should delete emergency contact successfully', async () => {
    mockEmergencyContactModel.findByIdAndDelete.mockResolvedValue(mockDeletedContact as any);

    const result = await (deleteEmergencyContact as any)({}, { id: validId }, {}, {});

    expect(mockEmergencyContactModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Emergency Contact deleted successfully.');
  });

  it('2. should return failure when emergency contact not found', async () => {
    mockEmergencyContactModel.findByIdAndDelete.mockResolvedValue(null);

    const result = await (deleteEmergencyContact as any)({}, { id: nonExistentId }, {}, {});

    expect(mockEmergencyContactModel.findByIdAndDelete).toHaveBeenCalledWith(nonExistentId);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Emergency Contact not found.');
  });

  it('3. should return failure when emergency contact is undefined', async () => {
    mockEmergencyContactModel.findByIdAndDelete.mockResolvedValue(undefined as any);

    const result = await (deleteEmergencyContact as any)({}, { id: nonExistentId }, {}, {});

    expect(mockEmergencyContactModel.findByIdAndDelete).toHaveBeenCalledWith(nonExistentId);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Emergency Contact not found.');
  });

  it('4. should handle database connection errors', async () => {
    const dbError = new Error('Database connection failed');
    mockEmergencyContactModel.findByIdAndDelete.mockRejectedValue(dbError);

    const result = await (deleteEmergencyContact as any)({}, { id: validId }, {}, {});

    expect(mockEmergencyContactModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred while deleting the Emergency Contact.');
    expect(console.error).toHaveBeenCalledWith('Failed to delete Emergency Contact:', dbError);
  });

  it('5. should handle invalid ObjectId format', async () => {
    const invalidId = 'invalid-object-id';
    const mongoError = new Error('Cast to ObjectId failed');
    mongoError.name = 'CastError';

    mockEmergencyContactModel.findByIdAndDelete.mockRejectedValue(mongoError);

    const result = await (deleteEmergencyContact as any)({}, { id: invalidId }, {}, {});

    expect(mockEmergencyContactModel.findByIdAndDelete).toHaveBeenCalledWith(invalidId);
    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred while deleting the Emergency Contact.');
    expect(console.error).toHaveBeenCalledWith('Failed to delete Emergency Contact:', mongoError);
  });

  it('6. should handle GraphQL errors from database', async () => {
    const graphQLError = new GraphQLError('Database access denied', {
      extensions: { code: 'FORBIDDEN', http: { status: 403 } }
    });

    mockEmergencyContactModel.findByIdAndDelete.mockRejectedValue(graphQLError);

    const result = await (deleteEmergencyContact as any)({}, { id: validId }, {}, {});

    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred while deleting the Emergency Contact.');
    expect(console.error).toHaveBeenCalledWith('Failed to delete Emergency Contact:', graphQLError);
  });

  it('7. should handle network timeout errors', async () => {
    const timeoutError = new Error('Request timeout');
    timeoutError.name = 'MongoNetworkTimeoutError';

    mockEmergencyContactModel.findByIdAndDelete.mockRejectedValue(timeoutError);

    const result = await (deleteEmergencyContact as any)({}, { id: validId }, {}, {});

    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred while deleting the Emergency Contact.');
    expect(console.error).toHaveBeenCalledWith('Failed to delete Emergency Contact:', timeoutError);
  });
});