'use client';

import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const order = {
  id: 33998,
  status: 'Дууссан',
  date: '2024.10.19 12:37',
  items: [
    {
      name: 'Taco',
      image: '/img/image-1.png',
      price: '15.6k',
      quantity: 1,
    },
    {
      name: 'Taco Taco TacoTacoTacoTacoTaco',
      image: '/img/image-1.png',
      price: '15.6k',
      quantity: 1,
    },
  ],
};

const OrderDetailPage = () => {
  const [quantities, setQuantities] = useState(order.items.map((item) => item.quantity));

  const updateQuantity = (index: number, diff: number) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] = Math.max(1, updated[index] + diff);
      return updated;
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-center text-xl font-bold text-amber-900 mb-6">Захиалгын дэлгэрэнгүй</h1>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Захиалгын дугаар:</p>
          <p className="text-lg font-semibold text-gray-800">#{order.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Захиалгын төлөв:</p>
          <p className="text-lg font-semibold text-gray-800">{order.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Захиалсан огноо:</p>
          <p className="text-lg font-semibold text-gray-800">{order.date}</p>
        </div>

        <hr className="my-4" />

        <div>
          <p className="text-sm text-gray-500 mb-2">Захиалга:</p>
          <div className="space-y-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{item.name}</p>
                  <p className="text-lg font-bold text-gray-800">{item.price}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button className="w-8 h-8 border rounded-md flex items-center justify-center text-lg" onClick={() => updateQuantity(i, -1)}>
                      <Minus size={16} />
                    </button>
                    <span>{quantities[i]}</span>
                    <button className="w-8 h-8 border rounded-md flex items-center justify-center text-lg" onClick={() => updateQuantity(i, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
