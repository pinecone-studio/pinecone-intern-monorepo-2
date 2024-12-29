import React from 'react';

const ContactInfo = () => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">Personal Information</p>
        <p className="text-xs text-gray-400">This is how others will see you on the site.</p>
      </div>

      <div className="w-full border border-gray-200" />

      <div></div>
    </div>
  );
};

export default ContactInfo;
