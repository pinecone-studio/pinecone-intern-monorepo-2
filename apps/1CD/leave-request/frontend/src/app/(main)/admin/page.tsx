import Table from '@/components/admin/Table';

import { SecureWrapper } from '@/context/SecurePageWrapper';

import React from 'react';

const AdminPage = () => {
  return (
    <SecureWrapper roles={["admin"]}>
      <Table />
      <footer className="mt-8 text-center text-gray-400">
        <p> &copy;2024 Copyright</p>
      </footer>
      ;
    </SecureWrapper>
  );
};

export default AdminPage;
