import React from 'react';
import Home from '../page';
import OrderHistory from './components/OrderHistory';
import Wallet from './components/Wallet';
import AccountEdit from './components/AccountEdit';

const page = () => {
  return (
    <div>
      <div><Home/></div>
      <div><Wallet/></div>
      <div><AccountEdit/></div>
      <div><OrderHistory /></div>
    </div>
  );
};

export default page;
