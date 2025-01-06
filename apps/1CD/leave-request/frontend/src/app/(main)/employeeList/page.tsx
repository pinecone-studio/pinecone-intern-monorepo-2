import EmployeeTable from '@/components/admin/EmployeeTable';
import React from 'react';

const EmployeeList = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <EmployeeTable />
      </div>
      <footer className="mt-8 text-center text-gray-400">
        <p>&copy;2024 Copyright</p>
      </footer>
    </div>
  );
};

export default EmployeeList;
