'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UpdateContact from '@/components/userprofile/UpdateContact';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showUpdateContact, setShowUpdateContact] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });

  const navigationItems = [
    'Profile',
    'Account', 
    'Appearance',
    'Notifications',
    'Display'
  ];

  const handleInputChange = (field: string, value: string) => {
    // firstName болон lastName талбаруудад эхний үсгийг том үсэг болгож, үлдсэнийг жижиг үсэг болгох
    let processedValue = value;
    if (field === 'firstName' || field === 'lastName') {
      // Зөвхөн үсэг, зай, цэг зөвшөөрөх
      const cleanedValue = value.replace(/[^a-zA-Zа-яёА-ЯЁ\s.]/g, '');
      // Эхний үсгийг том үсэг болгож, үлдсэнийг жижиг үсэг болгох
      processedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Утга оруулах үед алдааны мессежийг арилгах
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Утга оруулах үед дараагийн хуудас руу шилжихгүй - зөвхөн Update Profile товчлуур дарсны дараа л шилжинэ
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here - зөвхөн Update Profile товчлуур дарсны дараа л дараагийн хуудас руу шилжинэ
    console.log('Form submitted:', formData);
    // Энд дараагийн хуудас руу шилжихгүй
  };

  const handleUpdateProfile = () => {
    // Баталгаажуулалт - firstName, lastName, dateOfBirth хоосон байгаа эсэхийг шалгах
    const newErrors = {
      firstName: '',
      lastName: '',
      dateOfBirth: ''
    };
    
    let hasErrors = false;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Fill in your first name';
      hasErrors = true;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Fill in your last name';
      hasErrors = true;
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Fill in your date of birth';
      hasErrors = true;
    }
    
    setErrors(newErrors);
    
    // Алдаа байвал дараагийн хуудас руу шилжихгүй
    if (hasErrors) {
      return;
    }
    
    // Алдаа байхгүй бол дараагийн хуудас руу шилжинэ
    setShowUpdateContact(true);
  };

  const handleBackToProfile = () => {
    setShowUpdateContact(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Pedia</span>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                My Booking
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Shagai
              </a>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi, Shagai</h1>
          <p className="text-gray-600 mt-1">n.shagai@pinecone.mn</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {showUpdateContact ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <UpdateContact />
              </div>
            ) : (
              <>
                {activeTab === 'Profile' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600 mt-1">This is how others will see you on the site.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Write your first name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">Fill in your first name</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Write your last name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">Fill in your last name</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                          Date of birth
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">Fill in your date of birth</p>
                        )}
                        
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleUpdateProfile}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          Update Profile
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'Account' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                    <p className="text-gray-600">Account management options will go here.</p>
                  </div>
                )}

                {activeTab === 'Appearance' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                    <p className="text-gray-600">Appearance customization options will go here.</p>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                    <p className="text-gray-600">Notification preferences will go here.</p>
                  </div>
                )}

                {activeTab === 'Display' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Display</h2>
                    <p className="text-gray-600">Display settings will go here.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">P</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Pedia</span>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
