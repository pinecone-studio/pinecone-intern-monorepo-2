'use client';

import React from 'react';

const Wallet = () => {
  const balance = 999999999;

  const transactions = [
    { amount: +32456789, date: '24.10.19 15:25' },
    { amount: +21567899, date: '24.10.19 15:25' },
    { amount: +21456789, date: '24.10.19 15:25' },
    { amount: +276567898765, date: '24.10.19 15:25' },
    { amount: +1864567, date: '24.10.19 15:25' },
    { amount: +3245674, date: '24.10.19 15:25' },
    { amount: +245676, date: '24.10.19 15:25' },
    { amount: -188600, date: '24.10.19 15:25' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-amber-900">Хэтэвч</h2>
        <div className="text-4xl font-bold">{balance.toLocaleString()}</div>
        <p className="text-gray-500">Үлдэгдэл</p>
      </div>

      <div className="space-y-3">
        {transactions.map((t, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex justify-center items-center">{t.amount >= 0 ? <span className="text-green-500">↑</span> : <span className="text-red-500">↓</span>}</div>
              <span className={`font-semibold ${t.amount >= 0 ? 'text-black' : 'text-red-600'}`}>{t.amount >= 0 ? `+${t.amount}` : t.amount}</span>
            </div>
            <span className="text-sm text-gray-400">{t.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
