/* eslint-disable no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CirclePlus, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ConcertInput, concertSchema } from 'src/zodSchemas/create-concert';
import { Exact, GetConcertFilter, GetConcertQuery, InputMaybe, TicketType, useCreateConcertMutation, useGetArtistsQuery} from '@/generated';
import { useState } from 'react';
import { toast } from 'sonner';
import { PickDate, FormItemComp, SelectArtist } from '../_components';
import { ApolloQueryResult } from '@apollo/client';
export type RefetchConcert = (variables?: Partial<Exact<{
    input?: InputMaybe<GetConcertFilter>;
}>> | undefined) => Promise<ApolloQueryResult<GetConcertQuery>>
const CreateConcert = ({refetchConcert}:{refetchConcert:RefetchConcert}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ConcertInput>({
    resolver: zodResolver(concertSchema),
    values: {
      title: '',
      description: '',
      artists: [],
      schedule: [],
      venueId: '683421865ac6aef99c922dfa',
      thumbnailUrl: '',
      ticket: [
        {
          type: TicketType.Vip,
          quantity: 0,
          price: 0,
        },
        { type: TicketType.Standard, quantity: 0, price: 0 },
        { type: TicketType.Backseat, quantity: 0, price: 0 },
      ],
    },
  });
  const { data } = useGetArtistsQuery();
  const [createConcert, { loading }] = useCreateConcertMutation({
    onCompleted: () => {
      toast('Тасалбар амжилттай үүслээ');
      form.reset()
      setOpen(false)
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleCreateConcert = async (value: ConcertInput) => {
    await createConcert({
      variables: {
        input: value,
      },
    });
    await refetchConcert()
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-concert-modal-btn" variant="outline">
          Тасалбар Нэмэх
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[655px]">
        <DialogHeader>
          <DialogTitle>Тасалбар нэмэх</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleCreateConcert)}>
            <FormField control={form.control} name="title" render={({ field }) => <FormItemComp label="Тоглолтын нэр" field={field} />} />
            <FormField control={form.control} name="description" render={({ field }) => <FormItemComp label="Хөтөлбөрийн тухай" field={field} />} />
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>Хөтөлбөрийн зураг</Label>
                  <FormControl>
                    <Input data-cy="thumbnailUrl-url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="artists" render={({ field }) => <SelectArtist defaultValue={field.value} setValue={field.onChange} artists={data?.getArtists} />} />
            <FormField control={form.control} name="schedule" render={({ field }) => <PickDate setSchedule={field.onChange} schedule={field.value} />} />
            {form.getValues('ticket').map((ticket, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name={`ticket.${i}.quantity`} render={({ field }) => <FormItemComp label={`${ticket.type} - Тоо ширхэг`} field={field} />} />
                <FormField control={form.control} name={`ticket.${i}.price`} render={({ field }) => <FormItemComp label={`${ticket.type} - Үнэ`} field={field} />} />
              </div>
            ))}
            <Button data-cy="create-btn" disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : 'Үүсгэх'}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
export default CreateConcert;
