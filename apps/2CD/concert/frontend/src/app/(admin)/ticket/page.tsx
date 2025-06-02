'use client';

import { Container, Stack, Typography } from '@mui/material';

const Page = () => {
  return (
    <Container className="py-10" maxWidth="lg" data-cy="Concert-Page">
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography data-cy="Concert-Title">Тасалбар</Typography>
          <Typography data-cy="Concert-Subtitle">Идвэхтэй зарагдаж буй тасалбарууд</Typography>
        </Stack>
      </Stack>
    </Container>
  );
};
export default Page;
