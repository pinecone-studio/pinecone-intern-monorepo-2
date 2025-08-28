import { GraphQLError } from 'graphql';
import { EmergencyContactModel } from 'src/models';
import { getAllEmergencyContacts } from 'src/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  EmergencyContactModel: {
    find: jest.fn(),
  },
}));

const mockEmergencyContactModel = EmergencyContactModel as jest.Mocked<typeof EmergencyContactModel>;

describe('getAllEmergencyContacts', () => {
  const mockEmergencyContacts = [
    {
      _id: '68a30057d6c96dbd1101dd16',
      userId: '68a30057d6c96dbd1101aa11',
      name: 'John Doe',
      relationship: 'brother',
      phone: '99883344',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      _id: '68a30057d6c96dbd1101dd17',
      userId: '68a30057d6c96dbd1101aa12',
      name: 'Jane Smith',
      relationship: 'sister',
      phone: '88776655',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('1. should return all emergency contacts successfully', async () => {
    mockEmergencyContactModel.find.mockResolvedValue(mockEmergencyContacts as any);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(true);
    expect(result.message).toBe('All emergency contacts retrieved successfully.');
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      id: '68a30057d6c96dbd1101dd16',
      userId: '68a30057d6c96dbd1101aa11',
      name: 'John Doe',
      relationship: 'brother',
      phone: '99883344',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });
  });

  it('2. should return empty array when no emergency contacts found', async () => {
    mockEmergencyContactModel.find.mockResolvedValue([]);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(true);
    expect(result.message).toBe('No emergency contacts found.');
    expect(result.data).toEqual([]);
  });

  it('3. should handle single emergency contact', async () => {
    const singleContact = [mockEmergencyContacts[0]];
    mockEmergencyContactModel.find.mockResolvedValue(singleContact as any);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(true);
    expect(result.message).toBe('All emergency contacts retrieved successfully.');
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('68a30057d6c96dbd1101dd16');
  });

  it('4. should return error response when database query fails', async () => {
    const dbError = new Error('Database connection failed');
    mockEmergencyContactModel.find.mockRejectedValue(dbError);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred.');
    expect(result.data).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Failed to get all emergency contacts:', dbError);
  });

  it('5. should handle null response from database', async () => {
    mockEmergencyContactModel.find.mockResolvedValue(null as any);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(true);
    expect(result.message).toBe('No emergency contacts found.');
    expect(result.data).toEqual([]);
  });

  it('6. should handle undefined response from database', async () => {
    mockEmergencyContactModel.find.mockResolvedValue(undefined as any);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(mockEmergencyContactModel.find).toHaveBeenCalledWith({});
    expect(result.success).toBe(true);
    expect(result.message).toBe('No emergency contacts found.');
    expect(result.data).toEqual([]);
  });

  it('7. should properly format ObjectId fields to strings', async () => {
    const mockContactWithObjectId = {
      _id: { toString: () => '68a30057d6c96dbd1101dd16' },
      userId: { toString: () => '68a30057d6c96dbd1101aa11' },
      name: 'Test User',
      relationship: 'friend',
      phone: '123456789',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    mockEmergencyContactModel.find.mockResolvedValue([mockContactWithObjectId] as any);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(result.success).toBe(true);
    expect(result.data[0].id).toBe('68a30057d6c96dbd1101dd16');
    expect(result.data[0].userId).toBe('68a30057d6c96dbd1101aa11');
    expect(typeof result.data[0].id).toBe('string');
    expect(typeof result.data[0].userId).toBe('string');
  });

  it('8. should handle GraphQL errors thrown from database', async () => {
    const graphQLError = new GraphQLError('Database access denied');
    mockEmergencyContactModel.find.mockRejectedValue(graphQLError);

    const result = await (getAllEmergencyContacts as any)({}, {}, {}, {});

    expect(result.success).toBe(false);
    expect(result.message).toBe('An internal server error occurred.');
    expect(result.data).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Failed to get all emergency contacts:', graphQLError);
  });
});