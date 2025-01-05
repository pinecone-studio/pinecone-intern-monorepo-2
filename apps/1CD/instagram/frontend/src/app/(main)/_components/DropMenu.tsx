'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { UpdatePost } from '../../../components/post/UpdatePost';
import { DeleteModal } from '../../../components/post/DeleteModal';

export const DropMenu = ({ setClose, id, isUser }: { setClose: Dispatch<SetStateAction<boolean>>; isUser: boolean; id: string }) => {
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const handleUpdateModal = () => {
    return setClose(false), setOpenUpdateModal(true);
  };
  const handleDeleteModal = () => {
    return setClose(false), setOpenDeleteModal(true);
  };

  return (
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
      <UpdatePost id={id} setOpenUpdateModal={setOpenUpdateModal} openUpdateModal={openUpdateModal} />
      <DeleteModal id={id} openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} />
    </DropdownMenu>
  );
};
