/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

const initialItems = [
  { id: 1, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 2, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 3, name: 'Taco', image: 'image.png', price: '15.6k' },
  { id: 4, name: 'Taco', image: 'image.png', price: '15.6k' },
];

const formatPrice = (price: number) => `${(price / 1000).toFixed(1)}k`;

const HomeContainer = () => {
  const [items, setItems] = useState(initialItems);

  const handleReducePrice = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              price: formatPrice(
                Math.max(
                  0,
                  Math.round(Number(item.price.replace('k', '')) * 1000 * 0.8)
                )
              ), // 20% discount
            }
          : item
      )
    );
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 py-6">
      {items.map((item) => (
        <div key={item.id} data-testid="taco-item">
          <div className="relative rounded-xl overflow-hidden group">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <p className="text-gray-800 text-lg mt-2">{item.name}</p>
          <p data-testid={`price-${item.id}`} className="font-bold text-xl">
            {item.price}
          </p>
          <button
            data-testid={`sale-button-${item.id}`}
            onClick={() => handleReducePrice(item.id)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            20% Sale
          </button>
        </div>
      ))}
    </div>
  );
};

export default HomeContainer;
