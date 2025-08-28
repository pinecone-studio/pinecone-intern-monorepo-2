import { GraphQLError } from 'graphql';
import { EmergencyContactModel } from 'src/models';
import { getEmergencyContact } from 'src/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  EmergencyContactModel: {
    findById: jest.fn(),
  },
}));

const mockEmergencyContactModel = EmergencyContactModel as jest.Mocked<typeof EmergencyContactModel>;

describe('Get emergency contact', () => {
  const mockEmergencyContact = {
    _id: '68a30057d6c96dbd1101dd16',
    userId: '68a30057d6c96dbd1101aa11',
    name: 'Test emergency contact',
    relationship: 'brother',
    phone: '99883344',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should return emergency contact', async () => {
    mockEmergencyContactModel.findById.mockResolvedValue(mockEmergencyContact as any);

    const result = await (getEmergencyContact as any)(
      {},
      { id: '68a30057d6c96dbd1101dd16' },
      {},
      {}
    );

    expect(mockEmergencyContactModel.findById).toHaveBeenCalledWith('68a30057d6c96dbd1101dd16');
    expect(result.success).toBe(true);
    expect(result.data.id).toBe('68a30057d6c96dbd1101dd16');
  });

  it('2. should throw GraphQL error when emergency contact not found', async () => {
    mockEmergencyContactModel.findById.mockResolvedValue(null);
    
    try {
      await (getEmergencyContact as any)(
        {},
        { id: 'nonexistent-id' },
        {},
        {}
      );
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Emergency contact not found');
      expect((error as GraphQLError).extensions?.code).toBe('NOT_FOUND');
      expect((error as GraphQLError).extensions?.http).toEqual({ status: 404 });
    }
  });

  it('3. should throw GraphQLError when database query fails', async () => {
    mockEmergencyContactModel.findById.mockRejectedValue(new Error('Database error'));

    try {
      await (getEmergencyContact as any)({}, { id: '68a30057d6c96dbd1101dd16' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Emergency contact not found');
      expect((error as GraphQLError).extensions?.code).toBe('INTERNAL_SERVER_ERROR');
      expect((error as GraphQLError).extensions?.http).toEqual({ status: 500 });
    }
  });

  it('4. should re-throw GraphQLError when it is already a GraphQLError', async () => {
    const graphQLError = new GraphQLError('Custom GraphQL Error', {
      extensions: {
        code: 'CUSTOM_ERROR',
        http: { status: 400 }
      }
    });
    
    mockEmergencyContactModel.findById.mockRejectedValue(graphQLError);

    try {
      await (getEmergencyContact as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});
      fail('GraphQLError: Custom GraphQL Error');
    } catch (error) {
      expect(error).toBe(graphQLError);
      expect((error as GraphQLError).message).toBe('Custom GraphQL Error');
      expect((error as GraphQLError).extensions?.code).toBe('CUSTOM_ERROR');
    }
  });
});