'use client';
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ImageUpload from '../recs/_components/editPhoto/EditPhotos';
import { useGetMeQuery } from '@/generated';
import { useEditProfileMutation } from '@/generated';

const Profile = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const currentYear = new Date().getFullYear();
  const [selectedTab, setSelectedTab] = useState<'Profile' | 'Image'>('Profile');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [schoolWork, setSchoolWork] = useState<string[]>([]);
  const [attraction, setAttraction] = useState<string>('');
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const { data } = useGetMeQuery();
  const [editProfile] = useEditProfileMutation();

  const availableInterests = ['Art', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];

  useEffect(() => {
    if (data?.getMe) {
      const { name, email, bio, profession, schoolWork, attraction, interests, age } = data.getMe;
      setName(name || '');
      setEmail(email || '');
      setBio(bio || '');
      setProfession(profession || '');
      setSchoolWork(schoolWork || []);
      setAttraction(attraction || '');
      setUserInterests(interests || []);
      if (age) {
        const date = new Date(age);
        setDay(date.getDate().toString());
        setMonth((date.getMonth() + 1).toString());
        setYear(date.getFullYear().toString());
      }
    }
  }, [data]);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 31 || value === '')) {
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 12 || value === '')) {
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value) && (parseInt(value) <= currentYear || value === '')) {
      setYear(value);
    }
  };

  const handleInterestChange = (interests: string[]) => {
    setUserInterests(interests);
  };

  const handleNextButtonClick = () => {
    const age = calculateAge(day, month, year);

    if (age === null) {
      return;
    }
    editProfile({
      variables: {
        input: {
          name,
          email,
          bio,
          profession,
          schoolWork: [],
          attraction,
          interests: userInterests,
          age,
          photos: [],
        },
      },
    });

    setSelectedTab('Image');
  };

  const calculateAge = (day: string, month: string, year: string): number | null => {
    if (!day || !month || !year) {
      return null;
    }

    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col p-10 gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-2">Hi, {name}</h2>
          <p className="text-gray-500 mb-6">{email}</p>
          <div className="border-t-[1px]"></div>
        </div>

        <div className="flex gap-12 w-full max-sm:flex-col">
          <div className="flex flex-col">
            <ToggleGroup
              defaultValue="Profile"
              value={selectedTab}
              onValueChange={(value: 'Profile' | 'Image') => setSelectedTab(value)}
              type="single"
              className="sm:flex sm:flex-col sm:gap-1 max-sm:flex max-sm:justify-start"
            >
              <ToggleGroupItem value="Profile" aria-label="Toggle bold">
                <div className="w-[250px] h-[36px] flex items-center max-sm:w-[100px]" data-cy="profile-tab">
                  Profile
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="Image" aria-label="Toggle italic">
                <div className="w-[250px] h-[36px] flex items-center max-sm:w-[100px]" data-cy="image-tab">
                  Image
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {selectedTab === 'Profile' && (
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <p className="text-2xl text-gray-900 font-semibold">Personal Information</p>
                <p className="text-[#71717A] text-sm mt-[10px]">This is how others will see you on the site.</p>
              </div>
              <div className="border-t-[1px]"></div>
              {/* Name */}
              <div className="flex gap-6 max-sm:flex-col">
                <div>
                  <label className="block text-sm font-medium text-gray-700 w-[324px]" data-cy="profile-name-label">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm max-sm:w-[350px]"
                    data-cy="profile-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 w-[324px]" data-cy="profile-email-label">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm max-sm:w-[350px]"
                    data-cy="profile-email-input"
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" min="1" max="31" value={day} onChange={handleDayChange} placeholder="DD" className="px-4 py-2 border rounded-lg w-20" maxLength={2} data-cy="day-input" />
                  <input type="number" min="1" max="12" value={month} onChange={handleMonthChange} placeholder="MM" className="px-4 py-2 border rounded-lg w-20" maxLength={2} data-cy="month-input" />
                  <input type="number" min="1900" value={year} onChange={handleYearChange} placeholder="YYYY" className="px-4 py-2 border rounded-lg w-32" maxLength={4} data-cy="year-input" />
                </div>
                <p className="text-sm text-[#71717A]">Your date of birth is used to calculate your age.</p>
              </div>
              {/* Gender Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender Preferences</label>
                <Select value={attraction} onValueChange={setAttraction} data-cy="select-button">
                  <SelectTrigger className="w-[672px] max-sm:w-[350px]">
                    <SelectValue placeholder={attraction || data?.getMe.attraction} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Male" data-cy="male-select-content">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" data-cy="female-select-content">
                        Female
                      </SelectItem>
                      <SelectItem value="Both" data-cy="both-select-content">
                        Both
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700" data-cy="profile-bio-label">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm max-sm:w-[350px]"
                  data-cy="profile-bio-input"
                />
              </div>
              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <ToggleGroup
                  variant="outline"
                  type="multiple"
                  value={userInterests}
                  onValueChange={handleInterestChange}
                  className="border rounded-xl px-3 py-4 mt-1 max-sm:w-[350px]"
                  data-cy="interest-toggle-group"
                >
                  {availableInterests.map((interest) => (
                    <ToggleGroupItem key={interest} value={interest} aria-label={`Toggle ${interest}`} className={`h-6 ${userInterests.includes(interest) ? 'bg-gray-300' : ''}`} data-cy="toggle-item">
                      {interest}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <p className="text-xs text-gray-500 mt-1">You can select up to a maximum of 10 interests.</p>
              </div>
              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profession</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  data-cy="profile-profession-input"
                />
              </div>
              {/* School/Work */}
              <div>
                <label className="block text-sm font-medium text-gray-700">School/Work</label>
                <input
                  type="text"
                  value={schoolWork}
                  onChange={(e) => setSchoolWork([e.target.value])}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  data-cy="profile-school-input"
                />
              </div>
              {/* Next Button */}
              <Button onClick={handleNextButtonClick} className="bg-[#E11D48E5]" data-cy="next-button">
                Update Profile
              </Button>
            </form>
          )}
          {selectedTab === 'Image' && <ImageUpload />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
