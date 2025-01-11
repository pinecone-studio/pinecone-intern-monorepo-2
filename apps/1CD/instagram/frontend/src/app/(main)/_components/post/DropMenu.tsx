'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export const DropMenu = ({
  setClose,
  isUser,
  setOpenUpdateModal,
  setOpenDeleteModal,
}: {
  setClose: Dispatch<SetStateAction<boolean>>;
  setOpenUpdateModal: Dispatch<SetStateAction<boolean>>;
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  isUser: boolean;
}) => {
  const handleUpdateModal = () => {
    if (isUser) {
      return setClose(false), setOpenUpdateModal(true);
    }
    return;
  };
  const handleDeleteModal = () => {
    if (isUser) {
      return setClose(false), setOpenDeleteModal(true);
    }
    return;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-test="moreBtn" variant="ghost" className="w-4 h-4 p-0 ">
            <MoreVertical data-test="moreBtn" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent data-testid="moreBtnDetails">
          <DropdownMenuItem className="text-red-600" onClick={handleDeleteModal}>
            {isUser ? 'Delete' : 'Report'}
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="editBtn" onClick={handleUpdateModal}>
            {isUser ? 'Edit' : 'Hide'}
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="CancelBtn" onClick={() => setClose(false)}>
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
