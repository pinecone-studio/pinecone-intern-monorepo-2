import React from 'react';

type OrderStatus = 'Хүлээгдэж буй' | 'Бэлтгэгдэж буй';

interface Order {
  id: number;
  status: OrderStatus;
  date: string;
  amount: string;
}

const orders: Order[] = [
  {
    id: 33998,
    status: 'Хүлээгдэж буй',
    date: '24.10.19 15:25',
    amount: '42’800₮',
  },
  {
    id: 33998,
    status: 'Бэлтгэгдэж буй',
    date: '24.10.19 15:25',
    amount: '27’450₮',
  },
];

const ActiveOrders = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 px-4">
      {/* Header */}
      <h2 className="text-center text-xl font-semibold text-amber-900 mb-6">Идэвхтэй захиалга</h2>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className={`flex items-center justify-between rounded-xl p-4 ${order.status === 'Хүлээгдэж буй' ? 'bg-gray-100' : 'border border-gray-200'}`}>
            <div>
              <p className="font-bold text-base text-amber-900">
                #{order.id} <span className="ml-2 inline-block bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">{order.status}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{order.date}</p>
            </div>
            <div className="text-lg font-semibold text-gray-800">{order.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOrders;
