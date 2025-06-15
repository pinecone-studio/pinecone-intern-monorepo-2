'use client';

import { useState } from 'react';
import FormSectionWrapper from './FormSectionWrapper';

const DisplaySection = () => {
  const [fontSize, setFontSize] = useState('medium');

  return (
    <FormSectionWrapper title="Display Settings">
      <div>
        <label className="block text-sm font-medium">Font Size</label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">Set the size of text across the UI.</p>
      </div>
    </FormSectionWrapper>
  );
};

export default DisplaySection;
