'use client';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
}

interface Props {
  user: User | null;
}

const ProfileForm: React.FC<Props> = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth || '',
    });
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile data:', formData);
    toast.success('Profile updated!', { id: 'profile-toast' });
  };

  return (
    <div data-cy="profile-form-container" data-testid="profile-form-container" className="w-full max-w-2xl bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 data-cy="profile-form-title" className="text-2xl font-semibold text-gray-900 mb-4">
        Personal Information
      </h2>
      <p className="text-sm text-gray-500 mb-6">This is how others will see you on the site.</p>
      <form onSubmit={handleSubmit} data-cy="profile-form" data-testid="profile-form" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" data-cy="label-firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              data-cy="input-firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="First Name"
            />
          </div>

          <div>
            <label htmlFor="lastName" data-cy="label-lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              data-cy="input-lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" data-cy="label-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            data-cy="input-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
          />
        </div>

        <div>
          <label htmlFor="dob" data-cy="label-dob" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <input
              id="dob"
              data-cy="input-dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          data-cy="btn-updateProfile"
          type="submit"
          className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
