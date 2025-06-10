'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import FormSectionWrapper from './FormSectionWrapper';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ProfileSection = () => {
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dob, setDob] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI;

  const handleUpdateProfile = async () => {
    if (!backendUrl) {
      alert('Backend URL is not configured');
      return;
    }

    const profileData = {
      userId: user?.id,
      email: user?.emailAddresses?.[0]?.emailAddress,
      firstName,
      lastName,
      dob,
    };

    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const result = await res.json();
      alert('Profile updated successfully!');
      console.log('Profile update:', result);
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  return (
    <FormSectionWrapper title="Personal Information">
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="placeholder:text-gray-100 pl-[40px] w-[200px]"
        />
      </div>

      <div className="mt-6">
        <Button onClick={handleUpdateProfile}>Update Profile</Button>
      </div>
    </FormSectionWrapper>
  );
};

export default ProfileSection;
