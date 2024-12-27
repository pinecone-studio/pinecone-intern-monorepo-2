import { getUnitTicket } from '../../../../src/resolvers/queries/unit-ticket';
import UnitTicket from '../../../../src/models/unit-ticket.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/unit-ticket.model', () => ({
  findById: jest
    .fn()
    .mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce([
        {
          _id: '1',
          name: 'test-name',
        },
        {
          _id: '2',
          name: '2',
        },
      ]),
    })
    .mockReturnValueOnce({ populate: jest.fn().mockReturnValueOnce(null) }),
}));

describe('getUnitTicket query', () => {
  beforeEach(() => {
    (UnitTicket.findById as jest.Mock).mockClear();
  });
  it('should return the unit ticket with populated fields', async () => {
    const result = await getUnitTicket!({}, { unitId: 'ticketid123' }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]);
  });
  it('should throw an error if no unit ticket is found', async () => {
    try {
      await getUnitTicket!({}, { unitId: 'ticketid123' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Ticket not found'));
    }
  });
});
