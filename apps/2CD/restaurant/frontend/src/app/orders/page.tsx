'use client';

import React from 'react';

const orders = [
  { id: '#33998', date: '24.10.19 15:25', status: 'Бэлтгэгдэж буй', amount: "42'800₮", isPending: true },
  { id: '#33998', date: '24.10.19 15:25', status: 'Дууссан', amount: "27'450₮" },
  { id: '#33998', date: '24.10.19 15:25', status: 'Дууссан', amount: "18'900₮" },
  { id: '#33998', date: '24.10.19 15:25', status: 'Дууссан', amount: "21'900₮" },
  { id: '#33998', date: '24.10.19 15:25', status: 'Дууссан', amount: "24'200₮" },
  { id: '#33998', date: '24.10.19 15:25', status: 'Дууссан', amount: "19'750₮" },
];

const OrderHistory = () => {
  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-xl font-semibold text-amber-900 text-center mb-6">Захиалгын түүх</h2>

      <div className="space-y-3 max-w-md mx-auto">
        {orders.map((order, index) => (
          <div key={index} className={`flex justify-between items-center p-4 rounded-xl ${order.isPending ? 'bg-gray-100' : 'border border-gray-200'}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[15px] text-amber-900">{order.id}</span>
                <span className={`text-xs px-2 py-[2px] rounded-full ${order.isPending ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{order.date}</p>
            </div>

            <p className="text-lg font-semibold text-gray-800">{order.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
