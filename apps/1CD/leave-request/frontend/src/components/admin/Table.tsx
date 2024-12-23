import React from 'react';
import DatePickerButton from './DatePicker';
import CreateEmployee from './CreateEmployee';
import TableStatic from './TableStatic';

const Table = () => {
  return (
    <div className="w-full h-full mt-12 bg-[#F4F4F5] rounded-lg shadow-lg">
      <div className="flex items-center justify-between h-16 px-6 border-gray-200">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900">Нийт ажилчид</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100"></button>
            <DatePickerButton />
            <button className="p-2 rounded-lg hover:bg-gray-100"></button>
          </div>
          <CreateEmployee />
        </div>
      </div>
      <TableStatic />
    </div>
  );
};

export default Table;
