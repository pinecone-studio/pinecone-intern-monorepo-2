export const dynamic = 'force-dynamic';

import Order from '../../../models/order.model';

export async function GET(request: Request) {
  const currentDate = new Date();
  console.log('request', request);
  try {
    await Order.deleteMany({
      payment: 'pending',
      createdAt: { $lt: new Date(currentDate.getTime() - 2 * 60 * 1000) },
    });
    return new Response('Successfully deleted orders older than 2 minutes.', {
      status: 200,
    });
  } catch (error) {
    console.error('Error occurred while processing orders:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
