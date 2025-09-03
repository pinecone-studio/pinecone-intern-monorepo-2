/* eslint-disable max-lines */
'use client';

import { useState } from 'react';

interface ProfileSectionProps {
  onSuccess: (_message: string) => void;
}

export const ProfileSection = ({ onSuccess: _onSuccess }: ProfileSectionProps) => {
  const [formData, setFormData] = useState({
    name: 'Elon',
    email: 'Musk',
    dateOfBirth: '21 Aug 1990',
    genderPreferences: 'Female',
    bio: 'Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design.',
    profession: 'Software Engineer',
    schoolWork: 'Amazon',
    interests: ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food']
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile data:', { ...formData, selectedInterests });
    _onSuccess('Profile Updated Successfully');
  };

  return (
    <div className="max-w-xl">                        
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Personal Information</h2>
        <p className="text-gray-600 text-sm">This is how others will see you on the site.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of birth
          </label>
          <div className="relative">
            <input
              type="text"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 text-gray-900"
              placeholder="Select date"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1.5">Your date of birth is used to calculate your age.</p>
        </div>

        {/* Gender Preferences */}
        <div>
          <label htmlFor="genderPreferences" className="block text-sm font-medium text-gray-700 mb-1">
            Gender Preferences:
          </label>
          <select
            id="genderPreferences"
            value={formData.genderPreferences}
            onChange={(e) => handleInputChange('genderPreferences', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Interest</h3>
          <div className="flex flex-wrap gap-2.5 mb-2.5">
            {formData.interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedInterests.includes(interest)
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">You can select up to a maximum of 10 interests.</p>
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            Profession
          </label>
          <input
            type="text"
            id="profession"
            value={formData.profession}
            onChange={(e) => handleInputChange('profession', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
            placeholder="Enter your profession"
          />
        </div>

        {/* School/Work */}
        <div>
          <label htmlFor="schoolWork" className="block text-sm font-medium text-gray-700 mb-1">
            School/Work
          </label>
          <input
            type="text"
            id="schoolWork"
            value={formData.schoolWork}
            onChange={(e) => handleInputChange('schoolWork', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
            placeholder="Enter your school or workplace"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-base"
        >
          Update profile
        </button>
      </form>
    </div>
  );
}; 