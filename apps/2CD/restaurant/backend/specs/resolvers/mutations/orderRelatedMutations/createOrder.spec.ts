import { createOrder } from 'src/resolvers/mutations';
import { Order } from 'src/models/order-model';

jest.mock('src/models/order-model', () => ({
    Order: {
        countDocuments: jest.fn(),
        create: jest.fn(),
    },
}));

const mockOrder = Order as jest.Mocked<typeof Order>;

describe('createOrder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const validInput = {
        buyerId: 'buyer123',
        orderPrice: 25.99,
        tableNumber: 5,
        foodItems: [
            { foodId: 'food1', quantity: 2 },
            { foodId: 'food2', quantity: 1 },
        ],
    };

    it('should create a new order with correct data and order number', async () => {
        const mockCount = 10;
        const mockCreatedOrder = {
            _id: 'order123',
            orderNumber: 11,
            buyerId: 'buyer123',
            orderPrice: 25.99,
            tableNumber: 5,
            foodItems: [
                { foodId: 'food1', quantity: 2 },
                { foodId: 'food2', quantity: 1 },
            ],
            orderStatus: 'Хүлээгдэж буй',
        };

        mockOrder.countDocuments.mockResolvedValue(mockCount);
        mockOrder.create.mockResolvedValue(mockCreatedOrder as any);

        const result = await createOrder(null, { input: validInput });

        expect(mockOrder.countDocuments).toHaveBeenCalledTimes(1);
        expect(mockOrder.create).toHaveBeenCalledWith({
            orderNumber: mockCount + 1,
            buyerId: validInput.buyerId,
            orderPrice: validInput.orderPrice,
            tableNumber: validInput.tableNumber,
            foodItems: validInput.foodItems,
            orderStatus: 'Хүлээгдэж буй',
        });
        expect(result).toEqual(mockCreatedOrder);
    });

    it('should handle database errors and log them', async () => {
        const dbError = new Error('Database connection failed');
        mockOrder.countDocuments.mockRejectedValue(dbError);
        const consoleSpy = jest.spyOn(console, 'error');

        const result = await createOrder(null, { input: validInput });

        expect(consoleSpy).toHaveBeenCalledWith('Error creating order:', dbError);
        expect(result).toBeUndefined();
    });

    it('should handle Order.create errors', async () => {
        const createError = new Error('Validation failed');
        mockOrder.countDocuments.mockResolvedValue(5);
        mockOrder.create.mockRejectedValue(createError);
        const consoleSpy = jest.spyOn(console, 'error');

        const result = await createOrder(null, { input: validInput });

        expect(consoleSpy).toHaveBeenCalledWith('Error creating order:', createError);
        expect(result).toBeUndefined();
    });

    it('should generate order number 1 when count is 0', async () => {
        mockOrder.countDocuments.mockResolvedValue(0);
        mockOrder.create.mockResolvedValue({ orderNumber: 1 } as any);

        await createOrder(null, { input: validInput });

        expect(mockOrder.create).toHaveBeenCalledWith(
            expect.objectContaining({ orderNumber: 1 })
        );
    });
});