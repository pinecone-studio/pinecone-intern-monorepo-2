'use client';

import { Container, Stack, Typography } from '@mui/material';
import CreateConcert from './_features/CreateConcert';
import ConcertsTable from './_features/ConcertsTable';

const Page = () => {
  return (
    <Container className="py-10" maxWidth="lg" data-cy="Concert-Page">
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography data-cy="Concert-Title">Тасалбар</Typography>
          <Typography data-cy="Concert-Subtitle">Идвэхтэй зарагдаж буй тасалбарууд</Typography>
        </Stack>
        <CreateConcert />
      </Stack>
      <ConcertsTable/>
    </Container>
  );
};
export default Page;
