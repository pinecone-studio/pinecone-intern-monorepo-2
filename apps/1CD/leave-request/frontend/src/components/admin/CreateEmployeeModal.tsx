import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

export const CreateEmployeeModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Шинэ ажилтан бүртгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Шинэ ажилтан бүртгэх
            <button className="text-sm text-gray-500">
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
          <p className="text-sm text-gray-500">Дараах формыг бөглөж шинэ ажилтны мэдээллийг оруулна уу.</p>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <Label>Нэр, Овог</Label>
              <Input placeholder="Энд бичих..." />
            </div>
            <div>
              <Label>Албан тушаал</Label>
              <Input placeholder="Энд бичих..." />
            </div>
            <div>
              <Label>Имэйл</Label>
              <Input placeholder="Энд бичих..." />
            </div>
            <div>
              <Label>Ажилд орсон огноо</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Эрхийн тохируулах</Label>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline">Буцах</Button>
            <Button type="submit">Нэмэх</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
