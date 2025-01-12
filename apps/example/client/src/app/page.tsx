'use client';

import { Card, Container, IconButton, Stack, Typography } from '@mui/material';
import { useGetBooksQuery } from '../generated';
import { CreateBookModal } from '../components/CreateBookModal';
import DeleteIcon from '@mui/icons-material/Delete';

const Page = () => {
  const { data, loading, error, refetch } = useGetBooksQuery();

  const refresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <Container maxWidth="xs">
        <Stack py={8}>Error: {error.message}</Stack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Stack py={8}>Loading...</Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Stack py={8} minHeight="100vh" gap={2}>
        {data?.getBooks.map((book) => (
          <Card key={book._id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" alignItems="stretch">
              <Stack gap={2} flex={1}>
                <Typography color="primary" variant="h5">
                  {book.title}
                </Typography>
                <Stack direction="row" gap={1}>
                  <Typography color="text.secondary">Author:</Typography>
                  <Typography>{book.author.name}</Typography>
                </Stack>
              </Stack>

              <Stack alignItems="center" justifyContent="center">
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Card>
        ))}

        {data?.getBooks.length === 0 && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack>
              <Typography>No books found</Typography>
            </Stack>
          </Card>
        )}

        <CreateBookModal refetch={refresh} />
      </Stack>
    </Container>
  );
};

export default Page;
