import { Order } from '../../../models/order-model';

type OrderType = {
    buyerId: string;
    orderPrice: number;
    tableNumber: number;
    foodItems: Array<{
        foodId: string;
        quantity: number;
    }>;
}

export const createOrder = async (_: any, { input }: { input: OrderType }) => {
    const { buyerId, orderPrice, tableNumber, foodItems } = input;

    try {
        const count = await Order.countDocuments();
        const newOrder = await Order.create({
            orderNumber: count + 1,
            buyerId,
            orderPrice,
            tableNumber,
            foodItems,
            orderStatus: 'Хүлээгдэж буй',
        });
        return newOrder;
    } catch (error) {
        console.error('Error creating order:', error);
    }
};