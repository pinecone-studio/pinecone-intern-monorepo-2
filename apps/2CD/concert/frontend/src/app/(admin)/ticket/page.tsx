'use client';

import { Container, Stack, Typography } from '@mui/material';
import CreateConcert from './_features/CreateConcert';
import ConcertsTable from './_features/ConcertsTable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filterConcertInput, filterConcertSchema } from '@/zodSchemas/filter-concert';
import { useGetConcertQuery } from '@/generated';
import { formatISO } from 'date-fns';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
const Page = () => {
  const searchForm = useForm<filterConcertInput>({
    resolver: zodResolver(filterConcertSchema),
    values: {
      title: '',
      artists: [],
      day: undefined,
    },
  });
  const { data, refetch } = useGetConcertQuery({
    variables: {
      input: {
        title: searchForm.getValues('title'),
        artist: searchForm.getValues('artists'),
        date: searchForm.getValues('day') ? formatISO(searchForm.getValues('day') as Date, { representation: 'date' }) : null,
      },
    },
  });
  const debouncedRefetch = useMemo(
    () =>
      debounce((values: { title?: string | undefined; artists?: (string | undefined)[] | undefined; day?: Date | undefined }) => {
        const cleanArtists = (values.artists ?? []).filter((a): a is string => typeof a === 'string');
        refetch({
          input: {
            title: values.title,
            artist: cleanArtists,
            date: values.day ? formatISO(values.day, { representation: 'date' }) : null,
          },
        });
      }, 500),
    [refetch]
  );
  useEffect(() => {
    const subscription = searchForm.watch((values) => {
      debouncedRefetch(values);
    });
    return () => subscription.unsubscribe();
  }, [searchForm, debouncedRefetch]);
  return (
    <Container className="py-10" maxWidth="lg" data-cy="Concert-Page">
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography data-cy="Concert-Title">Тасалбар</Typography>
          <Typography data-cy="Concert-Subtitle">Идвэхтэй зарагдаж буй тасалбарууд</Typography>
        </Stack>
        <CreateConcert refetchConcert={refetch} />
      </Stack>
      <ConcertsTable refetchConcert={refetch} concerts={data?.getConcert} searchForm={searchForm} />
    </Container>
  );
};
export default Page;
