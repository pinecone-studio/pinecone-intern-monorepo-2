'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Pencil, Check, X } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState({
    phone: false,
    email: false,
    password: false,
  });

  const [user, setUser] = useState({
    phone: '99780680',
    email: 'mimosa.universe@gmail.com',
    password: '**********',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const handleChange = (key: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fields = useMemo(
    () =>
      [
        { key: 'phone', label: 'Утас:', type: 'text' },
        { key: 'email', label: 'Имэйл хаяг:', type: 'email' },
        { key: 'password', label: 'Нууц үг:', type: 'password' },
      ] as const,
    []
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-10 px-4">
      <h2 className="text-2xl font-semibold text-amber-900 mb-6">Хэрэглэгчийн хэсэг</h2>

      {/* Profile Picture */}
      <div className="relative mb-8">
        <label className="cursor-pointer relative block w-28 h-28 rounded-full overflow-hidden border bg-gray-100">
          {profileImage ? <Image src={profileImage} alt="Profile" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-amber-900">👤</div>}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <div className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow">
            <Pencil size={16} />
          </div>
        </label>
      </div>

      {/* Info Section */}
      <div className="w-full max-w-md space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="flex justify-between items-center border-b pb-2">
            <div className="w-full">
              <p className="text-sm text-gray-500">{field.label}</p>
              {isEditing[field.key] ? (
                <input className="text-lg border border-gray-300 rounded px-2 py-1 w-full" type={field.type} value={user[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} />
              ) : (
                <p className="text-lg break-words">{user[field.key]}</p>
              )}
            </div>
            <div className="flex gap-2 ml-2">
              {isEditing[field.key] ? (
                <>
                  <button onClick={() => toggleEdit(field.key)}>
                    <Check className="text-green-500" size={20} />
                  </button>
                  <button onClick={() => toggleEdit(field.key)}>
                    <X className="text-red-500" size={20} />
                  </button>
                </>
              ) : (
                <button onClick={() => toggleEdit(field.key)}>
                  <Pencil className="text-gray-600" size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
