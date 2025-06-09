import React from 'react';

const FormSectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="max-w-2xl mx-auto ml-[20px] space-y-6 text-left rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

export default FormSectionWrapper;
