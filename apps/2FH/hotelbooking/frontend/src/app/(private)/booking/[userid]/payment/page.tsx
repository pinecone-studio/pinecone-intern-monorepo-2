'use client';
import { PaymentParentComp } from '@/components/payment/PaymentParentComp';

const Booking = () => {
  return (
    <div data-cy="Payment-Component-Container" className="w-full">
      <PaymentParentComp />
    </div>
  );
};

export default Booking;
