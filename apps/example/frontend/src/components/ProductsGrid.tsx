'use client';

import { ProductGridCard, Container } from './';
import { useGetProductsQuery } from '../generated';
import Image from 'next/image';

export const ProductsGrid = () => {
  const { data } = useGetProductsQuery();

  const firstProduct = data?.getProducts[0];

  return (
    <Container>
      {firstProduct && (
        <div className="p-8 overflow-hidden shadow-xl rounded-2xl">
          <div className="relative h-[360px]  mb-8 cursor-pointer">
            <Image alt="" fill src={firstProduct.images[0]} className="object-contain" />

            <div className="absolute bottom-8 left-10">
              <p className="text-xl">{firstProduct.name}</p>
              <p className="text-5xl font-bold">{firstProduct.price.toLocaleString() + ' ₮'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 grid-rows-6 [&>div:nth-child(7)]:h-[700px] [&>div:nth-child(8)]:h-[700px] [&>div:nth-child(7)]:col-span-2 [&>div:nth-child(7)]:row-span-2 [&>div:nth-child(8)]:col-span-2 [&>div:nth-child(8)]:row-span-2 gap-5">
        {data?.getProducts.map((product) => (
          <ProductGridCard key={product._id} {...product} />
        ))}
      </div>
    </Container>
  );
};
