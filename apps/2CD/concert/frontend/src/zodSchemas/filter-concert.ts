import { TicketType } from '@/generated';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const filterConcertSchema = z.object({
  title: z.string().optional(),
  artists: z.array(z.string()).optional(),
  day: z.coerce.date().optional(),
});
export type filterConcertInput = z.infer<typeof filterConcertSchema>;
export type getConcerts =
  | {
      __typename?: 'Concert';
      description: string;
      featured: boolean;
      id: string;
      thumbnailUrl: string;
      title: string;
      totalProfit: number;
      artists: Array<{
        __typename?: 'Artist';
        name: string;
      }>;
      schedule: Array<{
        __typename?: 'Schedule';
        startDate: any;
      }>;
      ticket: Array<{
        __typename?: 'Ticket';
        type: TicketType;
        quantity: number;
        price: number;
        id: string;
      }>;
      venue: {
        __typename?: 'Venue';
        address: string;
        city: string;
        name: string;
      };
    }[]
  | undefined;
export type ConcertSearch = UseFormReturn<
  {
    title?: string | undefined;
    artists?: string[] | undefined;
    day?: Date | undefined;
  },
  any,
  undefined
>;
