'use client';

import { Button } from '@/components/ui/button';
import { Order } from '@/utils/type';
import React, { useState } from 'react';

type PaymentProp = {
  order: Order[] | null;
  createOrder: () => Promise<void>;
};

const Payment = ({ order, createOrder }: PaymentProp) => {
  const [mode, setMode] = useState(false);

  const totalPrice = order?.reduce((total, item) => total + item.price * item.buyQuantity, 0);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[#1C1C1C] rounded-lg max-w-xs mx-auto">
      <p className="text-white font-bold text-xl">
        Нийт төлөв дүн: {totalPrice} <span>₮</span>
      </p>
      <button
        data-cy="payment-select-button"
        onClick={() => setMode((prev) => !prev)}
        className={`
          flex items-center gap-2 p-2 rounded-md
          ${mode ? 'border-2 border-green-700' : 'border border-transparent'}
          hover:border-green-700 hover:bg-green-700 hover:text-white transition-all duration-300
       max-w-[200px]`}
      >
        <img src="/images/qpay.png" alt="Qpay" className="w-8 h-8" />
        <p className="text-white font-medium">PinePay</p>
      </button>
      {mode && (
        <Button data-cy="payment-submit-button" onClick={() => createOrder()} className="bg-green-700 text-white p-2 rounded-md hover:bg-green-700 w-auto max-w-[200px]">
          Төлбөр төлөх
        </Button>
      )}
    </div>
  );
};

export default Payment;
