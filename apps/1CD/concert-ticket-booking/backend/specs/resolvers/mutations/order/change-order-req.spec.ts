import Order from '../../../../src/models/order.model';
import Request from '../../../../src/models/request.model';
import { changeStatus } from '../../../../src/resolvers/mutations/order/change-order-req';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('apps/1CD/concert-ticket-booking/backend/src/models/order.model');
jest.mock('apps/1CD/concert-ticket-booking/backend/src/models/request.model');

describe('changeStatus Mutation', () => {
  const orderId = '674fe695ce75d25e68377676';
  const requestId = '67528850b109b254f4e33b13';

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully change the status of order and request', async () => {
    (Order.findOneAndUpdate as jest.Mock).mockResolvedValue({
      _id: orderId,
      status: 'approved',
    });

    (Request.findOneAndUpdate as jest.Mock).mockResolvedValue({
      _id: requestId,
      status: 'done',
    });

    const result = await changeStatus!({}, { input: { orderId, requestId } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'success' });
  });

  it('should return error message if order not found', async () => {
    (Order.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    (Request.findOneAndUpdate as jest.Mock).mockResolvedValue({
      _id: requestId,
      status: 'done',
    });

    const result = await changeStatus!({}, { input: { orderId, requestId } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'error' });
  });

  it('should return error message if request not found', async () => {
    (Order.findOneAndUpdate as jest.Mock).mockResolvedValue({
      _id: orderId,
      status: 'approved',
    });

    (Request.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await changeStatus!({}, { input: { orderId, requestId } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'error' });
  });
});
