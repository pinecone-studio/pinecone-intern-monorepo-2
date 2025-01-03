/* eslint-disable  complexity */

'use client';
import React, { useState } from 'react';
import OrderDetail from '../_components/OrderDetail';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Order, UserInfo } from '@/utils/type';
import OrderConfirm from '../_components/OrderConfirm';
import Payment from '../_components/Payment';
import { toast } from 'sonner';
import { useAddToCartsMutation } from '@/generated';

const OrderTicketPage = () => {
  const [currentState, setCurrentState] = useState<number>(1);
  const [order, setOrder] = useState<Order[]>([]);
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [quantity, setQuantity] = useState<number[]>([]);
  const [buyer, setBuyer] = useState<UserInfo>();

  const handleUndo = () => {
    if (currentState === 1) {
      router.push(`/user/home/event/${eventId}`);
    } else if (currentState === 2) {
      setCurrentState(1);
    } else {
      setCurrentState(2);
    }
  };
  const handleQuantityChange = (idx: number, id: string, price: number, name: string, operation: 'add' | 'sub') => {
    setQuantity((prevQuantity) => {
      const newQuantity = [...prevQuantity];
      if (operation === 'add') {
        newQuantity[idx] += 1;
      } else if (operation === 'sub' && newQuantity[idx] > 0) {
        newQuantity[idx] -= 1;
      }
      setOrder((prevOrder) => {
        const updatedOrder = [...prevOrder];
        const orderIndex = updatedOrder.findIndex((item) => item._id === id);
        if (orderIndex > -1) {
          updatedOrder[orderIndex].buyQuantity = newQuantity[idx];
        } else {
          updatedOrder.push({ _id: id, buyQuantity: newQuantity[idx], price, zoneName: name });
        }
        if (newQuantity[idx] === 0) {
          updatedOrder.splice(orderIndex, 1);
        }
        return updatedOrder;
      });
      return newQuantity;
    });
  };
  const [addToCart] = useAddToCartsMutation({
    onCompleted: () => {
      toast.success('Successfully buy ticket check your email');
      router.push('/user/home');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const createOrder = async () => {
    const ticketType = order.map((item) => ({
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
          ticketType: ticketType,
        },
      },
    });
  };

  return (
    <div
      className="min-h-[calc(100vh-1px)] bg-black align-center flex flex-col w-full h-screen gap-10"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
      data-cy="order-ticket-page"
    >
      <header className="flex justify-between items-center w-3/6 h-[80px] flex text-white text-[16px] mx-10" data-cy="order-ticket-header">
        <Button onClick={handleUndo} className="text-white" data-cy="undo-button">
          Undo
        </Button>
        <div className="text-white">
          {currentState === 1 && 'Тасалбар захиалах'}
          {currentState === 2 && 'Захиалга баталгаажуулах'}
          {currentState === 3 && 'Төлбөр төлөх'}
        </div>
      </header>
      <div className="mt-4">
        {currentState === 1 && <OrderDetail setQuantity={setQuantity} quantity={quantity} handleQuantityChange={handleQuantityChange} order={order} setOrder={setOrder} setState={setCurrentState} />}
        {currentState === 2 && <OrderConfirm setBuyer={setBuyer} setState={setCurrentState} order={order} />}
        {currentState === 3 && <Payment order={order} createOrder={createOrder} />}
      </div>
    </div>
  );
};

export default OrderTicketPage;

