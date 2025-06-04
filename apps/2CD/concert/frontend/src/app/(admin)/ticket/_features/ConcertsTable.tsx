'use client';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketType, useGetArtistsQuery, useGetConcertQuery } from '@/generated';
import { Stack } from '@mui/material';
import { Star, X } from 'lucide-react';
import { SelectArtist, SelectDay } from '../_components';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filterConcertInput, filterConcertSchema } from '@/zodSchemas/filter-concert';
import { FormControl, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const ConcertsTable = () => {
  const { data: artist } = useGetArtistsQuery();
  const searchForm = useForm<filterConcertInput>({
    resolver: zodResolver(filterConcertSchema),
    values: {
      title: '',
      artists: [],
      day: undefined,
    },
  });
  const { data } = useGetConcertQuery({
    variables: {
      input: {
        title: searchForm.getValues('title'),
        date: searchForm.getValues('day') as Date,
        artist: searchForm.getValues('artists'),
      },
    },
  });
  const totalTicket = (
    ticket: {
      __typename?: 'Ticket';
      price: number;
      quantity: number;
      type: TicketType;
    }[]
  ) => {
    const tickets = {
      vip: ticket.find((t) => t.type === 'VIP')?.quantity ?? 0,
      regular: ticket.find((t) => t.type === 'STANDARD')?.quantity ?? 0,
      general: ticket.find((t) => t.type === 'BACKSEAT')?.quantity ?? 0,
    };
    const total = tickets.vip + tickets.regular + tickets.general;
    return total;
  };


  return (
    <Stack>
      <Stack direction={'row'}>
        <FormProvider {...searchForm}>
          <form className="w-full flex justify-between">
            <Stack direction={'row'}>
              <FormField
                control={searchForm.control}
                name="title"
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                )}
              />
              <FormField
                control={searchForm.control}
                name="artists"
                render={({ field }) => <SelectArtist hideLabel={true} defaultValue={field.value as string[]} setValue={field.onChange} artists={artist?.getArtists} />}
              />
              <Button type="button" onClick={() => searchForm.reset()} className="bg-white text-black border flex gap-2">
                Цэвэрлэх <X size={16} />
              </Button>
            </Stack>
            <FormField control={searchForm.control} name="day" render={({ field }) => <SelectDay hideLabel={true} setDay={field.onChange} day={field.value} />} />
          </form>
        </FormProvider>
      </Stack>
      <Table className="bg-white" data-cy="Concert-Table">
        <TableHeader>
          <TableRow>
            <TableHead>Онцлох</TableHead>
            <TableHead>Тоглолтын нэр</TableHead>
            <TableHead>Артист</TableHead>
            <TableHead>Нийт тоо</TableHead>
            <TableHead>VIP</TableHead>
            <TableHead>Regular</TableHead>
            <TableHead>Задгай</TableHead>
            <TableHead>Тоглох өдрүүд</TableHead>
            <TableHead>Нийт ашиг</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.getConcert.map((concert, index) => (
            <TableRow key={concert.id} data-cy={`Concert-Row-${index}`}>
              <TableCell data-cy="is-featured">{concert.featured && <Star />}</TableCell>
              <TableCell data-cy="concert-title">{concert.title}</TableCell>
              <TableCell data-cy="concert-artists">
                <div className="flex">
                  {concert.artists.map((a, i) => (
                    <div key={i}>{a.name}</div>
                  ))}
                </div>
              </TableCell>
              <TableCell data-cy="concert-total-tickets">{totalTicket(concert.ticket)}</TableCell>
              <TableCell data-cy="concert-vip">{concert.ticket.find((ticket) => ticket.type === 'VIP')?.quantity ?? 0}</TableCell>
              <TableCell data-cy="concert-standard">{concert.ticket.find((ticket) => ticket.type === 'STANDARD')?.quantity ?? 0}</TableCell>
              <TableCell data-cy="concert-backseat">{concert.ticket.find((ticket) => ticket.type === 'BACKSEAT')?.quantity ?? 0}</TableCell>
              <TableCell data-cy="concert-schedule">
                {concert.schedule.map((date, i) => {
                  const d = new Date(date.startDate);
                  const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
                  return <div key={i}>{formatted}</div>;
                })}
              </TableCell>
              <TableCell data-cy="concert-profit">{concert.totalProfit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
export default ConcertsTable;
