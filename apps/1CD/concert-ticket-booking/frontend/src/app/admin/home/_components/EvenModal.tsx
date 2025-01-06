'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { CirclePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { EventInputSchema } from '@/utils/validation-schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import InputForm from './TicketInputs';
import InputImage from '@/app/admin/home/_components/InputImage';
import InputGenreWithLocation from './GenreWithLocation';
import TimePicker from './TimePicker';
import { DatePickerWithRange } from './DatePicker';
import InputArtist from './InputArtist';
import { useCreateEventMutation } from '@/generated';
import { toast } from 'sonner';

const CreateEventModal = ({ refetch }: { refetch: () => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof EventInputSchema>>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: {
      name: '',
      mainArtists: [{ name: '' }],
      guestArtists: [{ name: '' }],
      category: [],
      ticketType: [
        { zoneName: 'VIP', discount: '', unitPrice: '', totalQuantity: '', additional: '' },
        { zoneName: 'Backstage', discount: '', unitPrice: '', totalQuantity: '', additional: '' },
        { zoneName: 'Regular', discount: '', unitPrice: '', totalQuantity: '', additional: '' },
      ],
    },
  });
  const [createEvent, { loading }] = useCreateEventMutation({
    onCompleted: () => {
      toast.success('Successfully created');
      setDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast.error('An error occurred');
    },
  });

  const onSubmit = async (values: z.infer<typeof EventInputSchema>) => {
    await createEvent({
      variables: {
        input: values,
      },
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="inline-flex items-center justify-center" data-testid="create-event-button">
          Тасалбар нэмэх <CirclePlus className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex justify-between" data-testid="modal-title">
            <span>Тасалбар нэмэх</span>
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
                      <FormLabel data-testid="event-input-label" className="text-xs">
                        Тоглолтын нэр оруулах <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="p-2 rounded-sm" placeholder="Нэр оруулах" {...field} data-testid="event-name-input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <InputImage form={form} />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Хөтөлбөрийн тухай <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea className="p-2 resize-none rounded-sm" placeholder="Дэлгэрэнгүй мэдээлэл" {...field} data-testid="event-description-input" />
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
                <Button data-cy="Create-Event-Submit-Button" className="p-2 text-white bg-black rounded-sm" type="submit" data-testid="submit-button" disabled={loading}>
                  {loading ? 'loading' : 'Үүсгэх'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default CreateEventModal;
