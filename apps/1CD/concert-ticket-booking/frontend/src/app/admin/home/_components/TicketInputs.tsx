'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EventInputType } from '@/utils/validation-schema';

type FormProps = {
  form: UseFormReturn<EventInputType>;
};

const InputForm = ({ form }: FormProps) => {
  const { fields: ticketsFields } = useFieldArray({
    control: form.control,
    name: 'ticketType',
  });

  return (
    <Form {...form}>
      <div className="flex gap-2 my-4" data-testid="ticket-type-fields">
        {ticketsFields.map((item, index) => (
          <div key={index} className="flex flex-col gap-2" data-testid={`ticket-type-${index}`}>
            <FormField
              control={form.control}
              name={`ticketType.${index}.zoneName`}
              render={({ field }) => (
                <FormItem data-testid={`zone-name-field-${index}`}>
                  <FormLabel data-testid={`zone-name-label-${index}`}>
                    {item.zoneName} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="hidden">
                    <Input readOnly placeholder="zoneName" {...field} data-testid={`zone-name-input-${index}`} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ticketType.${index}.discount`}
              render={({ field }) => (
                <FormItem data-testid={`discount-field-${index}`}>
                  <FormControl>
                    <Input placeholder="Хөнгөлөлт" {...field} data-testid={`discount-input-${index}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ticketType.${index}.unitPrice`}
              render={({ field }) => (
                <FormItem data-testid={`unit-price-field-${index}`}>
                  <FormControl>
                    <Input placeholder="Нэгж үнэ" {...field} data-testid={`unit-price-input-${index}`} />
                  </FormControl>
                  <FormMessage data-testid={`unit-price-message-${index}`} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ticketType.${index}.totalQuantity`}
              render={({ field }) => (
                <FormItem data-testid={`total-quantity-field-${index}`}>
                  <FormControl>
                    <Input placeholder="Тоо хэмжээ" {...field} data-testid={`total-quantity-input-${index}`} />
                  </FormControl>
                  <FormMessage data-testid={`total-quantity-message-${index}`} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ticketType.${index}.additional`}
              render={({ field }) => (
                <FormItem data-testid={`additional-field-${index}`}>
                  <FormControl>
                    <Input placeholder="Нэмэлт" {...field} data-testid={`additional-input-${index}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </Form>
  );
};

export default InputForm;
