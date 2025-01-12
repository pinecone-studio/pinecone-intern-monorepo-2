'use client';

import { Button } from '@/components/ui/button';
import { useAddToCartsMutation, usePaymentCheckMutation } from '@/generated';
import { Order, UserInfo } from '@/utils/type';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { useAuth } from '@/components/providers';

type PaymentProp = {
  order: Order[] | null;
  buyer: UserInfo;
};

const Payment = ({ order, buyer }: PaymentProp) => {
  const { setRefetchOrder } = useAuth();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [mode, setMode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const router = useRouter();

  const [addToCart] = useAddToCartsMutation({
    onCompleted: (data) => {
      setMode(false);
      triggerFunction({ orderId: data.addToCarts._id });
      setPaymentId(data.addToCarts._id);
    },
    onError: (error: any) => {
      setMode(false);
      toast.error(error.message);
    },
  });

  const createOrder = async () => {
    const ticketType = order?.map((item) => ({
      _id: item._id,
      buyQuantity: item.buyQuantity.toString(),
    }));
    await addToCart({
      variables: {
        input: {
          email: buyer!.email,
          phoneNumber: buyer!.phoneNumber,
          eventId: eventId!,
          ticketId: id as string,
          ticketType: ticketType!,
        },
      },
    });
  };
  const triggerFunction = async ({ orderId }: { orderId: string }) => {
    const queryUrl = `${process.env.LOCAL_FRONTEND_URI}/user/payment/${orderId}`;
    const qrCodeData = await QRCode.toDataURL(queryUrl);
    setQrCodeUrl(qrCodeData);
  };
  const [paymentCheck] = usePaymentCheckMutation({
    onCompleted: (data) => {
      if (data.paymentCheck.message === 'paid') {
        toast.success('Successfully bought ticket, check your email');
        setRefetchOrder((pre) => !pre);
        router.push('/user/home');
      }
    },
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (paymentId) {
      intervalId = setInterval(async () => {
        await paymentCheck({
          variables: {
            orderId: paymentId,
          },
        });
      }, 5000); //5s

      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        toast.info('Payment check has been stopped due to time limit.');
        router.push('/user/home');
      }, 120000); //2minute
    }
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [paymentId, paymentCheck]);

  const totalPrice = order?.reduce((total, item) => total + item.price * item.buyQuantity, 0);
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[#1C1C1C] rounded-lg max-w-xs mx-auto">
      <p className="flex justify-between text-xl text-white">
        Нийт төлөх дүн: {totalPrice} <span>₮</span>
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
        <p className="font-medium text-white">PinePay</p>
      </button>
      {mode && (
        <Button data-cy="payment-submit-button" onClick={() => createOrder()} className="bg-green-700 text-white p-2 rounded-md hover:bg-green-700 w-auto max-w-[200px]">
          Төлбөр төлөх
        </Button>
      )}
      {qrCodeUrl && (
        <div className="flex flex-col items-center text-center">
          <p data-cy="payment-qr-title" className="text-white text-2xl mb-4">
            Scan this QR code for payment:
          </p>
          <img src={qrCodeUrl} alt="QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default Payment;
