import React from 'react';
import DatePickerButton from './DatePicker';
import CreateEmployee from './CreateEmployee';
import TableStatic from './TableStatic';

const Table = () => {
  return (
    <div className="w-full h-full bg-[#F4F4F5] mt-12">
      <div className="flex justify-between items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-900">Нийт ажилчид</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
            </button>
            <DatePickerButton />
            <button className="p-2 hover:bg-gray-100 rounded-lg">
            </button>
          </div>
          <CreateEmployee />
        </div>
      </div>
      <TableStatic />
    </div>
  );
};

export default Table;
