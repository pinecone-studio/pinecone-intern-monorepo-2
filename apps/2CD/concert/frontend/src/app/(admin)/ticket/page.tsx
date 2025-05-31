'use client';

import { Container, Stack, TextField, Typography } from '@mui/material';
import { Button } from '@/components/ui/button';
import CreateConcert from './_features/CreateConcert';

const Page = () => {
  return (
    <Container className="py-10" maxWidth="lg" data-cy="Concert-Page">
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography data-cy="Concert-Title">Тасалбар</Typography>
          <Typography data-cy="Concert-Subtitle">Идвэхтэй зарагдаж буй тасалбарууд</Typography>
        </Stack>
        <CreateConcert/>
      </Stack>
      <div className="flex gap-4 items-center" data-cy="Concert-Search-Bar">
        <TextField size="small" placeholder="Тасалбар хайх" data-cy="Concert-Search-Input" />
        <Button variant="outline" data-cy="Concert-Clear-Button">
          Цэвэрлэх
        </Button>
      </div>
    </Container>
  );
};
export default Page;
