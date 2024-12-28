import React from 'react';

interface EmployeeProps {
  employees: Array<{ _id: string; userName: string }>;
}

const EmployeeList: React.FC<EmployeeProps> = ({ employees }) => {
  return (
    <div>
      {employees.map((employee) => (
        <div key={employee._id}>{employee.userName}</div>
      ))}
    </div>
  );
};

export default EmployeeList;
