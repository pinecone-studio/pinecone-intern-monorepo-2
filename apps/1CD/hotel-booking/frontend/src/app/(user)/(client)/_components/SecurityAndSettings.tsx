'use client';

import React from 'react';

const SecurityAndSettings = () => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">Security & Settings</p>
        <p className="text-xs text-gray-400">keep your account safe with a secure password</p>
      </div>

      <div className="w-full border border-gray-200" />

      <div className="flex gap-6">
        <div className="border rounded-xl"></div>
      </div>
    </div>
  );
};

export default SecurityAndSettings;
