'use client';

import { Button, Card, MenuItem, Modal, Stack, TextField, Typography } from '@mui/material';
import { useCreateBookMutation, useGetAuthorsQuery } from '../generated';
import { useState } from 'react';
import { CreateAuthorModal } from './CreateAuthorModal';

type CreateBookModalProps = {
  refetch: () => Promise<void>;
};

export const CreateBookModal = ({ refetch }: CreateBookModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  const { data, loading, error, refetch: authorsRefetch } = useGetAuthorsQuery();

  const [createBook, { loading: creationLoading }] = useCreateBookMutation();

  const handleCreateBook = async () => {
    await createBook({
      variables: {
        title,
        authorId,
      },
    });

    await refetch();

    setTitle('');
    setAuthorId('');

    handleModalClose();
  };

  const refreshAuthors = async () => {
    await authorsRefetch({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  return (
    <>
      <Button data-testid="add-book-open-modal-btn" variant="contained" color="primary" onClick={handleModalOpen}>
        Create Book
      </Button>

      <Modal data-testid="add-book-modal" open={isModalOpen} onClose={handleModalClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card>
          <Stack p={2} gap={2} sx={{ width: 400 }}>
            <Typography variant="h5">Create Book</Typography>

            <TextField
              data-testid="book-title-input"
              label="Title"
              fullWidth
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />

            <Stack direction="row" alignItems="center" gap={1}>
              <TextField
                data-testid="author-select"
                label="Author"
                select
                fullWidth
                value={authorId}
                onChange={(event) => {
                  setAuthorId(event.target.value);
                }}
              >
                {loading && <MenuItem>Loading...</MenuItem>}

                {data?.getAuthors.map((author) => (
                  <MenuItem key={author._id} data-testid={`option-${author._id}`} value={author._id}>
                    {author.name}
                  </MenuItem>
                ))}
              </TextField>

              <CreateAuthorModal refetch={refreshAuthors} />
            </Stack>

            <Button data-testid="create-book-btn" variant="contained" color="primary" fullWidth disabled={creationLoading} onClick={handleCreateBook}>
              {creationLoading ? 'Creating...' : 'Create'}
            </Button>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};
