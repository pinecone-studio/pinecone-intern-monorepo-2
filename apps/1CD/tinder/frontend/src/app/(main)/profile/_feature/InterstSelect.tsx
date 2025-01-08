// _feature/InterestsSelect.tsx
import React from 'react';

interface InterestsSelectProps {
  interests: string[];
}

const InterestsSelect: React.FC<InterestsSelectProps> = ({ interests }) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm text-zinc-950">Interest</p>
    <div className="border border-zinc-400 py-2 px-3 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1 rounded-md">
      {interests.map((interest, index) => (
        <div key={index} className="text-xs font-semibold text-slate-700 bg-zinc-100 text-center px-3 py-1 rounded-full">
          {interest}
        </div>
      ))}
    </div>
    <p className="text-xs text-zinc-500">You can select up to a maximum of 10 interests.</p>
  </div>
);

export default InterestsSelect;
