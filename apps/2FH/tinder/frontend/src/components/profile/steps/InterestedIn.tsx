'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSignup } from '@/components/profile/SignupContext';

export const InterestedInSelection: React.FC = () => {
    const { signupData, handleInputChange, nextStep, prevStep } = useSignup();
    const [isInterestedInDropdownOpen, setIsInterestedInDropdownOpen] = useState(false);
    const interestedInDropdownRef = useRef<HTMLDivElement>(null);

    const interestedIn = ['Male', 'Female', 'Both',];

    const handleInterestedInSelect = (interestedIn: string) => {
        handleInputChange({ interestedIn: interestedIn as any }); // ✅ context-д хадгална
        setIsInterestedInDropdownOpen(false);
    };

    const canProceed = !!signupData.interestedIn; // ✅ interestedIn сонгогдсон эсэхийг шалгана

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (interestedInDropdownRef.current && !interestedInDropdownRef.current.contains(event.target as Node)) {
                setIsInterestedInDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col bg-white items-center h-full">
            <div className="w-full max-w-md text-center space-y-4">
                {/* Interested In Section */}
                <div className="text-left w-full">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Interested In</h3>
                </div>
                <div className="relative" ref={interestedInDropdownRef}>
                    <input
                        type="text"
                        value={signupData.interestedIn || ''} // ✅ context-с авна
                        onFocus={() => setIsInterestedInDropdownOpen(true)}
                        placeholder={signupData.interestedIn ? '' : 'Select interested in'}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer text-gray-700"
                        readOnly
                    />
                    <button
                        type="button"
                        onClick={() => setIsInterestedInDropdownOpen(!isInterestedInDropdownOpen)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {isInterestedInDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                            {interestedIn.map((interestedIn) => (
                                <button
                                    key={interestedIn}
                                    type="button"
                                    onClick={() => handleInterestedInSelect(interestedIn)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {interestedIn}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                    <button onClick={prevStep} className="px-3 py-1 border border-gray-300 font-semibold rounded-full text-gray-700 hover:opacity-70 transition-all duration-200">Back</button>

                    <button
                        onClick={nextStep}
                        disabled={!canProceed}
                        className={`ml-auto px-3 py-1 rounded-full font-semibold text-white ${canProceed
                            ? "bg-pink-500 hover:bg-red-500"
                            : "bg-gray-300 cursor-not-allowed opacity-50"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-gray-400 text-sm">©2024 Tinder</div>
        </div>
    );
};
