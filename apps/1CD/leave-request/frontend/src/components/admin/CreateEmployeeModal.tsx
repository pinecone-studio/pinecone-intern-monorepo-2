'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications
import { useCreateUserMutation } from '@/generated';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CreateEmployeeModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    position: '',
    email: '',
    hireDate: '',
    role: '',
  });

  const [createUser, { loading }] = useCreateUserMutation({
    onCompleted: () => {
      toast.success('Ажилтан амжилттай бүртгэгдлээ');
      setOpen(false);
      setFormData({
        userName: '',
        position: '',
        email: '',
        hireDate: '',
        role: '',
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        variables: {
          email: formData.email,
          userName: formData.userName,
          profile: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.userName)}`, // Generate default avatar
          role: formData.role,
          position: formData.position,
          hireDate: formData.hireDate,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <button className="text-sm text-gray-500" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
          <p className="text-sm text-gray-500">Дараах формыг бөглөж шинэ ажилтны мэдээллийг оруулна уу.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Нэр, Овог</Label>
              <Input name="userName" value={formData.userName} onChange={handleInputChange} placeholder="Энд бичих..." required />
            </div>
            <div>
              <Label>Албан тушаал</Label>
              <Input name="position" value={formData.position} onChange={handleInputChange} placeholder="Энд бичих..." required />
            </div>
            <div>
              <Label>Имэйл</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Энд бичих..." required />
            </div>
            <div>
              <Label>Ажилд орсон огноо</Label>
              <Input name="hireDate" type="date" value={formData.hireDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label>Эрхийг тохируулах</Label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    role: value === 'Ахлах ажилтан' ? 'supervisor' : 'supervisee',
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ажилтаны эрх" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ажилтан">Ажилтан</SelectItem>
                  <SelectItem value="Ахлах ажилтан">Ахлах ажилтан</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Буцах
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Үүсгэж байна...' : 'Нэмэх'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
