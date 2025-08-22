'use client';

import { CheckoutForm } from '../../components/providers/checkout/_components/CheckoutForm';
import { Confirmed } from '../../components/providers/checkout/_components/Confirmed';
import { Header } from '../../components/providers/checkout/_components/Header';

const Page = () => {
  return (
    <div className="px-4 lg:px-80">
      <Header />
      <div className="flex gap-4 px-15 py-8">
        <CheckoutForm />
        <Confirmed />
      </div>
    </div>
  );
};

export default Page;
