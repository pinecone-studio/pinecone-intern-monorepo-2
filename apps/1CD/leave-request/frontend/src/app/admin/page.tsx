import Header from '@/components/admin/Header';
import Table from '@/components/admin/Table';

import React from 'react';

const AdminPage = () => {
  return (
    <>
      <Header />
      <Table />
      <footer className="mt-8 text-center text-gray-400">
        <p> &copy;2024 Copyright</p>
      </footer>
      ;
    </>
  );
};

export default AdminPage;
