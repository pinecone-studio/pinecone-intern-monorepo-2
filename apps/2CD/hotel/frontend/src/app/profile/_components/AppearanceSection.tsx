'use client';

import React, { useState } from 'react';
import FormSectionWrapper from './FormSectionWrapper';

const AppearanceSection = () => {
  const [theme, setTheme] = useState('light');

  return (
    <FormSectionWrapper title="Appearance">
      <div>
        <label className="block text-sm font-medium">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">Choose how the site should appear.</p>
      </div>
    </FormSectionWrapper>
  );
};

export default AppearanceSection;
