'use client';
import { FC, useState } from 'react';
import { useGetAllUsersQuery } from '@/generated';
import { useUpdateUserMutation } from '@/generated';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TableStaticDataless: FC = () => {
  const { data, loading, error } = useGetAllUsersQuery();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [updateEmployeeRole] = useUpdateUserMutation();

  const onConfirm = () => {
    setOpenDialogId(null);
  };
  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p>Алдаа гарлаа: {error.message}</p>;

  const setIsOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setOpenDialogId(null);
    }
  };
  return (
    <div className="mx-[43px] mr-[37px] overflow-hidden rounded-lg">
      <table className="w-full rounded-lg shadow-lg border bg-[#F4F4F5]">
        <thead>
          <tr className="text-left">
            {['№', 'Нэр, Овог', 'Албан тушаал', 'Имэйл', 'Ажилд орсон огноо'].map((header, index) => (
              <th key={index} className={`px-4 py-2 text-xs font-semibold text-black border border-[#E4E4E7] ${index === 0 ? 'rounded-tl-lg' : index === 8 ? 'rounded-tr-lg' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.getAllUsers?.map((employee, index) => (
            <tr key={employee?._id} className="bg-white hover:bg-gray-100">
              <td className="text-center px-4 py-2 text-sm text-gray-600 border border-[#E4E4E7]">{index + 1}</td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900 border border-[#E4E4E7]">{employee?.userName}</td>
              <td className="px-4 py-2 text-sm text-gray-600 border border-[#E4E4E7]">{employee?.position}</td>
              <td className="px-4 py-2 text-sm text-gray-600 border border-[#E4E4E7]">{employee?.email}</td>
              <td className="px-4 py-2 text-sm text-gray-600 border border-[#E4E4E7]">{new Date(employee?.hireDate).toLocaleDateString('en-CA')}</td>
              <td className="px-4 py-2 text-center border border-[#E4E4E7]">
                <Dialog open={openDialogId === employee?._id} onOpenChange={setIsOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-medium">{employee?.role === 'admin' ? 'Ахлах ажилтныг хасах' : 'Ахлах ажилтныг баталгаажуулах'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-gray-600">
                        Та {employee?.userName} -ийг {employee?.role === 'admin' ? 'ахлах ажилтны эрхийг хасах' : 'ахлах ажилтан болгох'} гэж байна. Баталгаажуулна уу.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsOpen(false)} className="px-6">
                        Буцах
                      </Button>
                      <Button
                        onClick={async () => {
                          await updateEmployeeRole({
                            variables: {
                              email: employee?.email,
                              role: employee?.role === 'admin' ? 'user' : 'admin',
                            },
                          });
                          onConfirm();
                        }}
                        className="px-6 bg-black hover:bg-gray-800"
                      >
                        Зөвшөөрөх
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-gray-600">{`1-${data?.getAllUsers?.length} ажилтан харуулж байна (Нийт: ${data?.getAllUsers?.length})`}</div>
    </div>
  );
};
export default TableStaticDataless;
