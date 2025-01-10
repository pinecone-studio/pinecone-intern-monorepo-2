import React from 'react';

const ProfessionalInfo: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-zinc-950">Profession</p>
        <input placeholder="Software Engineer" className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3 mt-2" />
      </div>
      <div>
        <p className="text-sm text-zinc-950">School/Work</p>
        <input placeholder="Amazon" className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3 mt-2" />
      </div>
    </div>
  );
};

export default ProfessionalInfo;
