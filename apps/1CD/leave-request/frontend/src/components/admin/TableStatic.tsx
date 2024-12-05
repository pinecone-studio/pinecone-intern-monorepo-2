import { FC } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  startDate: string;
  requiredWorkDays: number;
  leaveHours: number;
  paidLeaveDays: number;
  isSelected: boolean;
}

interface TableStaticProps {
  employees?: Employee[];
  onSelectEmployee?: (_id: number) => void;
}

const TableStatic: FC<TableStaticProps> = ({ employees = [], onSelectEmployee }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Нэр, Овог</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Албан тушаал</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Имэйл</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Ажилд орсон огноо</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Зайлшгүй ажиллах өдөр</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Чөлөө авсан цаг</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Цалинтай чөлөө авсан өдөр</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Хүсэлт батлах</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-4">
                <span className="font-medium text-gray-900">{employee.name}</span>
              </td>
              <td className="px-4 py-4 text-gray-600">{employee.position}</td>
              <td className="px-4 py-4 text-gray-600">{employee.email}</td>
              <td className="px-4 py-4 text-gray-600">{employee.startDate}</td>
              <td className="px-4 py-4 text-gray-600">{employee.requiredWorkDays} өдөр</td>
              <td className="px-4 py-4 text-gray-600">{employee.leaveHours} цаг</td>
              <td className="px-4 py-4 text-gray-600">{employee.paidLeaveDays} өдөр</td>
              <td className="px-4 py-4">
                <input type="checkbox" checked={employee.isSelected} onChange={() => onSelectEmployee?.(employee.id)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableStatic;
