'use client';

import { useState } from 'react';
import FormSectionWrapper from './FormSectionWrapper';

const AccountSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdate = () => {
    console.log('Account Updated:', { email, password });
  };

  return (
    <FormSectionWrapper title="Account Settings">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="Enter new password"
        />
      </div>

      <div className="flex justify-start mt-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Account
        </button>
      </div>
    </FormSectionWrapper>
  );
};

export default AccountSection;
