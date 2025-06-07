/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

const initialItems = [
  { id: 1, name: 'Taco', image: 'image.png', price: 15600 },
  { id: 2, name: 'Taco', image: 'image.png', price: 15600 },
  { id: 3, name: 'Taco', image: 'image.png', price: 15600 },
  { id: 4, name: 'Taco', image: 'image.png', price: 15600 },
];

const HomeContainer = () => {
  const [items] = useState(initialItems);

  return (
    <div className="flex gap-[20px] flex-wrap justify-center items-center w-full">
      {items.map((item) => (
        <div key={item.id} className="w-[40vw] h-fit flex flex-col gap-2">
          <div className='w-full aspect-square overflow-hidden rounded-[5px]'>
            <img src={item.image} alt={item.name} className='w-full h-full object-cover'/>
          </div>
          <div className='flex flex-col text-[18px]'>
            <div className='font-light'>{item.name}</div>
            <div className='font-semibold'>{(item.price/1000).toFixed(1)}k</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeContainer;
