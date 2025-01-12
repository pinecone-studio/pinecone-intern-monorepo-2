'use client';

import { Button, Card, IconButton, Modal, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useCreateAuthorMutation } from '../generated';

type CreateAuthorModalProps = {
  refetch: () => Promise<void>;
};

export const CreateAuthorModal = ({ refetch }: CreateAuthorModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  const [createAuthor, { loading }] = useCreateAuthorMutation();

  const handleAuthorCreate = async () => {
    await createAuthor({
      variables: {
        name,
      },
    });

    await refetch();

    setName('');

    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleModalOpen} data-testid="add-author-open-modal-btn">
        <AddIcon />
      </IconButton>

      <Modal data-testid="create-author-modal" open={isModalOpen} onClose={handleModalClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card>
          <Stack p={2} gap={2} sx={{ width: 400 }}>
            <Typography variant="h5">Create Author</Typography>

            <TextField
              data-testid="author-name-input"
              label="Name"
              fullWidth
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />

            <Button data-testid="create-author-btn" variant="contained" color="primary" disabled={loading} fullWidth onClick={handleAuthorCreate}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};
