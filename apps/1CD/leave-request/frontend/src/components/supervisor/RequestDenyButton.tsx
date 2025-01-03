'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllRequestSupervisor } from '@/context/GetAllRequestBySupervisorContext';
import { useUpdateRequestMutation } from '@/generated';
import React, { useState } from 'react';
import { GoX } from 'react-icons/go';

const DenyButton = ({ id, refetch }: { id: string; refetch: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const [updatesRequest] = useUpdateRequestMutation();
  const { reload } = useGetAllRequestSupervisor();
  const [comment, setcomment] = useState('');
  const deny = async () => {
    await updatesRequest({ variables: { id, result: 'failed', comment } });
    setOpen(false);
    refetch()
    reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#F4F4F5] text-[#18181B] text-sm font-medium">
          <GoX size={16} />
          Татгалзах
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[592px] sm:min-h-[374px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#09090B]">Татгалзсан шалтгаан</DialogTitle>
          <DialogDescription className="mt-[6px] text-[#71717A] text-sm mb-6">Тухайн ажилтанд яагаад татгалзаж байгаагаа тайлбарлан бичнэ үү.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <textarea
              onChange={(e) => setcomment(e.target.value)}
              placeholder="Энд бичнэ үү"
              className="border-[1px] border-[#E4E4E7] rounded-md px-3 py-[10px] placeholder:text-sm placeholder:text-[#71717A] min-h-[196px]"
            ></textarea>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" className="bg-white border-[1px] border-[#E4E4E7] rounded-md px-4 py-2 text-sm text-[#18181B] font-medium" onClick={() => setOpen(false)}>
            Цуцлах
          </Button>
          <Button type="submit" className="bg-[#18181B] rounded-md px-4 py-2 text-sm text-[#FAFAFA] font-medium" onClick={deny}>
            Илгээх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DenyButton;
