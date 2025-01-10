'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { EventInputSchema } from '@/utils/validation-schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import InputForm from './TicketInputs';
import InputGenreWithLocation from './GenreWithLocation';
import TimePicker from './TimePicker';
import { DatePickerWithRange } from './DatePicker';
import InputArtist from './InputArtist';
import { Event, useUpdateEventMutation } from '@/generated';
import { toast } from 'sonner';
import InputImageEditing from './InputImageEditing';

const EditingDialog = ({ event, refetch }: { event: Event; refetch: () => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const date = new Date(event.scheduledDays[0]);
  const time = date.toISOString().split('T')[1].split(':')[0];
  const minute = date.toISOString().split('T')[1].split(':')[1];
  const form = useForm<z.infer<typeof EventInputSchema>>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: {
      time: {
        hour: time,
        minute: minute,
      },
      name: event.name,
      image: event.image,
      description: event.description,
      venue: event.venue._id,
      mainArtists: event.mainArtists,
      guestArtists: event.guestArtists?.map((artist) => {
        return { name: artist?.name };
      }),
      category: event.category,
      dateRange: { from: new Date(event.scheduledDays[0]), to: new Date(event.scheduledDays[event.scheduledDays.length - 1]) },
      ticketType: event.products[0].ticketType.map((type) => {
        return {
          zoneName: type.zoneName,
          _id: type._id,
          additional: type.additional ?? undefined,
          discount: type.discount ?? undefined,
          soldQuantity: type.soldQuantity,
          totalQuantity: type.totalQuantity,
          unitPrice: type.unitPrice,
        };
      }),
    },
  });
  const [updateEvent, { loading }] = useUpdateEventMutation({
    onCompleted: () => {
      toast.success('Successfully updated');
      setDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast.error('An error occurred');
    },
  });
  const onSubmit = async (values: z.infer<typeof EventInputSchema>) => {
    await updateEvent({
      variables: {
        id: event._id,
        event: {
          category: values.category,
          description: values.description,
          guestArtists: values.guestArtists,
          image: values.image,
          mainArtists: values.mainArtists,
          name: values.name,
          products: [
            {
              _id: event.products[0]._id,
              scheduledDay: event.products[0].scheduledDay,
              ticketType: values.ticketType.map((type) => {
                return {
                  zoneName: type.zoneName,
                  totalQuantity: type.totalQuantity,
                  unitPrice: type.unitPrice,
                };
              }),
            },
          ],
          venue: values.venue,
        },
      },
    });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Pencil className="h-5 w-5 bg-[#F4F4F5] rounded cursor-pointer p-[2px]" data-testid={`edit-event-button-${event._id}`} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex justify-between" data-cy="modal-title">
            <span>Тасалбар засах</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 p-2">
              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-cy="event-input-label" className="text-xs">
                        Тоглолтын нэр оруулах <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="p-2 rounded-sm" placeholder="Нэр оруулах" {...field} data-cy="event-name-input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <InputImageEditing form={form} />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Хөтөлбөрийн тухай <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea className="p-2 resize-none rounded-sm" placeholder="Дэлгэрэнгүй мэдээлэл" {...field} data-cy="event-description-input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <InputGenreWithLocation form={form} />
                <InputArtist form={form} />
                <div className="flex items-center gap-4 my-4">
                  <DatePickerWithRange form={form} />
                  <TimePicker form={form} />
                </div>
                <InputForm form={form} />
                <Button className="p-2 text-white bg-black rounded-sm" type="submit" data-cy="submit-button" disabled={loading}>
                  {loading ? 'loading' : 'засах'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default EditingDialog;
