'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRefresh } from './RefreshProvider';

export const CreateProjectButton = () => {
  const { refresh } = useRefresh();

  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleCreate = async () => {
    setLoading(true);

    await fetch(`/api/groups/${projectName}`, {
      method: 'POST',
    });

    setLoading(false);
    setIsOpen(false);

    refresh();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <Button size="sm" className="p-1 h-fit" onClick={handleOpen}>
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Write your project name" className="col-span-3" value={projectName} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            {loading ? <Loader2 size={12} className="animate-spin" /> : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
