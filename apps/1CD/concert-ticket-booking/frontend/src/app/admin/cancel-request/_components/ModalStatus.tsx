'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useChangeStatusMutation } from '@/generated';
import { useState } from 'react';
import { toast } from 'sonner';

type RequestStatus = {
  idx: number;
  name: string;
  status: string;
  orderId: string;
  reqId: string;
  refetch: () => void;
};

export const StatusChangeModal = ({ status, orderId, reqId, name, idx, refetch }: RequestStatus) => {
  const [open, setOpen] = useState(false);
  const [changeStatus, { loading }] = useChangeStatusMutation({
    onCompleted: () => {
      toast.success('Successfully changed status');
      refetch();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const handleChange = (orderId: string, reqId: string) => {
    changeStatus({
      variables: {
        input: {
          orderId,
          requestId: reqId,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} data-cy="status-change-modal">
      <DialogTrigger asChild>
        <Button disabled={status === 'done'} data-cy={`status-change-trigger-${idx}`}>
          {status === 'pending' ? 'илгээх' : 'шилжүүлсэн'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-cy="status-change-dialog-content">
        <DialogHeader>
          <DialogTitle data-cy="status-change-dialog-title">Төлөв өөчлөх</DialogTitle>
          <DialogDescription data-cy="status-change-dialog-description">{name} харилцагчийн төлбөрийн буцаалтыг шилжүүлсэн үү?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={loading} onClick={() => handleChange(orderId, reqId)} type="submit" data-cy="status-change-submit-button">
            шилжүүлсэн
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
