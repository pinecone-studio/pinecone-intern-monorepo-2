'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllRequestSupervisor } from '@/context/GetAllRequestBySupervisorContext';
import { useUpdateRequestMutation } from '@/generated';
import React from 'react';
import { GoCheck } from 'react-icons/go';

const ApproveButton = ({ id, refetch}: { id: string, refetch: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const [updatesRequest] = useUpdateRequestMutation();
  const { reload } = useGetAllRequestSupervisor();
  const approve = async () => {
    await updatesRequest({ variables: { id, result: 'success' } });
    setOpen(false);
    refetch()
    reload()
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#18181B] text-[#FAFAFA] text-sm font-medium">
          <GoCheck size={16} />
          Зөвшөөрөх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-[#09090B] font-semibold">Та итгэлтэй байна уу?</DialogTitle>
          <DialogDescription className="text-sm text-[#71717A]">Чөлөөний хүсэлтийг зөвшөөрснөөр тухайн ажилтан руу хүсэлт нь баталгаажсан гэсэн мессеж Teams Chat -аар очно.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" className="bg-white border-[1px] border-[#E4E4E7] rounded-md px-4 py-2 text-sm text-[#18181B] font-medium" onClick={() => setOpen(false)}>
            Буцах
          </Button>

          <Button type="submit" className="bg-[#18181B] rounded-md px-4 py-2 text-sm text-[#FAFAFA] font-medium" onClick={approve}>
            Зөвшөөрөх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveButton;
