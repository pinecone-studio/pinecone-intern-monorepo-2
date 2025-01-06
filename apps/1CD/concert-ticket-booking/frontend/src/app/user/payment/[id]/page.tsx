'use client';

import { usePaymentTicketsMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const QRGeneratePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [paymentTicket] = usePaymentTicketsMutation({
    onCompleted: () => {
      toast.success('Thank you for your purchase, please check your email');
      router.push('/user/home');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const makePayment = async () => {
    await paymentTicket({
      variables: {
        orderId: params.id,
      },
    });
  };
  useEffect(() => {
    makePayment();
  }, []);
  return (
    <div>
      <h1 data-cy="payment-page-title">Payment page</h1>
    </div>
  );
};
export default QRGeneratePage;
