'use client';

import { FC } from 'react';
import { useGetAllUsersQuery } from '@/generated';

interface TableStaticProps {
  onSelectEmployee?: (_id: number) => void;
}

const TableStatic: FC<TableStaticProps> = () => {
  const { data, loading, error } = useGetAllUsersQuery();

  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p>Алдаа гарлаа: {error.message} </p>;

  return (
    <div className="w-full mx-8 bg-white border border-gray-200 rounded-lg">
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">№</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Нэр, Овог</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Албан тушаал</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Имэйл</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Ажилд орсон огноо</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Зайнаас ажилласан өдөр</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Чөлөө авсан цаг</th>
            <th className="px-6 py-4 text-xs font-semibold text-black border-r border-gray-200">Цалинтай чөлөө авсан өдөр</th>
            <th className="px-6 py-4 text-xs font-semibold text-black">Хүсэлт батлах ажилтан болгох</th>
          </tr>
        </thead>
        <tbody>
          {data?.getAllUsers?.map((employee, index) => (
            <tr key={employee?._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{index + 1}</td>
              <td className="px-6 py-4 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-900">{employee?.userName}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{employee?.position}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{employee?.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{employee?.hireDate}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200"> өдөр</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200"> цаг</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200"> өдөр</td>
              <td className="flex justify-center px-6 py-4">
                <input type="checkbox" checked={employee?.role === 'admin'} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableStatic;
