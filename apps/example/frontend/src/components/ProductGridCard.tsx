'use client';

import Image from 'next/image';
// import Link from 'next/link';
import { Product } from '../generated';

export const ProductGridCard = ({ _id, price, name, images }: Product) => {
  return (
    <div data-testid="product-card">
      {/* <Link href={`/products/${_id}`}> */}
      <div key={price} className="space-y-2">
        <div className="p-6 shadow-xl rounded-2xl">
          <div className="relative pt-[136%] overflow-hidden">
            <Image alt={name} fill src={images[0]} className="object-contain" />
          </div>
        </div>
        <div>
          <div>{name}</div>
          <div>{price.toLocaleString()}</div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};
