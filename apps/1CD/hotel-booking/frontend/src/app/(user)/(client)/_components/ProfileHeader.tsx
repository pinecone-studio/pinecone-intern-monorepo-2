import React from 'react';

const ProfileHeader = () => {
  const data = {
    firstName: 'Shagai',
    email: 'shagai@pinecone.mn',
  };
  return (
    <div className="w-2/3 px-10 py-4 border-b-2 border-gray-200" data-cy="Update-Profile-Header">
      <div className="w-full">
        <h1 className="text-3xl font-semibold">Hi, {data.firstName}</h1>
        <p className="text-xs text-gray-400">{data.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
