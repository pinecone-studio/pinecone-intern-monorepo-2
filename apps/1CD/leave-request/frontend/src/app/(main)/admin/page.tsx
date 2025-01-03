import Table from '@/components/admin/Table';
import React from 'react';

const AdminPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Table />
      </div>
      <footer className="mt-8 text-center text-gray-400 hover:text-gray-600">
        <p> &copy;2024 Copyright</p>
      </footer>
    </div>
  );
};

export default AdminPage;
