'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/AuthProvider';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Order, UserInfo } from '@/utils/type';

type OrderConfirmProp = {
  order: Order[] | null;
  setBuyer: Dispatch<SetStateAction<UserInfo | undefined>>;
  setState: Dispatch<SetStateAction<number>>;
};

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  phoneNumber: z.string().min(8, { message: 'Must be a valid mobile number' }).max(14, { message: 'Must be a valid mobile number' }),
});

const inputs = [
  {
    name: 'phoneNumber',
    label: 'Утасны дугаар',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Имэйл хаяг',
    type: 'email',
  },
] as const;

const OrderConfirm = ({ order, setBuyer, setState }: OrderConfirmProp) => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setBuyer({ email: values.email, phoneNumber: values.phoneNumber });
    setState(3);
  };

  useEffect(() => {
    form.reset({
      email: user?.email,
      phoneNumber: user?.phoneNumber ?? '',
    });
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8 justify-center">
        <div className="w-full max-w-xl bg-[#09090B] p-8 rounded-2xl shadow-lg border border-gray-600">
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-6">Захиалагчийн мэдээлэл</h1>
          <div className="space-y-6">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white">{input.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={input.type}
                        className="w-full p-3 bg-black text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#00B7f4] placeholder:text-gray-400"
                        placeholder={input.label}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="mt-8">
            <p className="text-white font-semibold">Бүтээгдэхүүний тоо: {order && order.reduce((total, item) => total + item.buyQuantity, 0)}</p>
            <div className="mt-4 space-y-4">
              {order &&
                order.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-white">
                    <p>
                      {item.zoneName} x {item.buyQuantity}
                    </p>
                    <p>{item.price * item.buyQuantity} ₮</p>
                  </div>
                ))}
            </div>
            <div className="mt-6 border-t border-gray-500 pt-4">
              <p className="text-white font-bold">Нийт төлөх дүн: {order && order.reduce((total, item) => total + item.price * item.buyQuantity, 0)} ₮</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button data-cy="order-confirm-button" type="submit" className="px-6 py-3 bg-[#00B7f4] text-black font-semibold rounded-md hover:bg-[#00a7d4] transition duration-300">
              Үргэжлүүлэх
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OrderConfirm;
