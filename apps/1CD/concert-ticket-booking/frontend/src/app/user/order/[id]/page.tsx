/* eslint-disable  complexity */

'use client';
import React, { useState } from 'react';
import OrderDetail from '../_components/OrderDetail';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Order, OrderState, UserInfo } from '@/utils/type';
import OrderConfirm from '../_components/OrderConfirm';
import Payment from '../_components/Payment';
import { toast } from 'sonner';
import { useAddToCartsMutation } from '@/generated';

const OrderTicketPage = () => {
  const [currentState, setCurrentState] = useState<OrderState>(OrderState.SELECT_TICKET);
  const [order, setOrder] = useState<Order[]>([]);
  const [buyer, setBuyer] = useState<UserInfo | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [quantity, setQuantity] = useState<number[]>([]);
  const validTicketId = Array.isArray(id) ? id[0] : id;
  const handleUndo = () => {
    if (currentState === OrderState.SELECT_TICKET) {
      router.push(`/user/home/event/${eventId}`);
    } else if (currentState === OrderState.CONFIRM_ORDER) {
      setCurrentState(OrderState.SELECT_TICKET);
    } else if (currentState === OrderState.PAYMENT) {
      setCurrentState(OrderState.CONFIRM_ORDER);
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
    if (!buyer || !validTicketId) {
      toast.error('Please provide buyer information or event ID');
      return;
    }
    const ticketType = order.map((item) => ({
      _id: item._id,
      buyQuantity: item.buyQuantity.toString(),
    }));

    try {
      await addToCart({
        variables: {
          input: {
            email: buyer.email,
            phoneNumber: buyer.phoneNumber,
            eventId: eventId!,
            ticketId: validTicketId!,
            ticketType: ticketType,
          },
        },
      });
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <header className="flex justify-between items-center">
        <Button onClick={handleUndo} className="text-white">
          Undo
        </Button>
        <div className="text-white">
          {currentState === OrderState.SELECT_TICKET && 'Тасалбар захиалах'}
          {currentState === OrderState.CONFIRM_ORDER && 'Захиалга баталгаажуулах'}
          {currentState === OrderState.PAYMENT && 'Төлбөр төлөх'}
        </div>
      </header>
      <div className="mt-4">
        {currentState === OrderState.SELECT_TICKET && (
          <OrderDetail setQuantity={setQuantity} quantity={quantity} handleQuantityChange={handleQuantityChange} order={order} setOrder={setOrder} setState={setCurrentState} />
        )}
        {currentState === OrderState.CONFIRM_ORDER && <OrderConfirm setBuyer={setBuyer} setState={setCurrentState} order={order} />}
        {currentState === OrderState.PAYMENT && <Payment order={order} createOrder={createOrder} />}
      </div>
    </div>
  );
};

export default OrderTicketPage;
