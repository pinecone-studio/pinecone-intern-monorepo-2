'use client';

import React from 'react';
import { useProfileFilter } from './ProfileFilter';
import { Profile } from '../../generated';

interface ProfileFilterExampleProps {
    profiles: Profile[];
    currentUserId: string;
    userInterestedIn: string;
}

/**
 * Example component demonstrating how to use the ProfileFilter hook
 * This shows how profiles are filtered based on the user's interestedIn preference
 */
export const ProfileFilterExample: React.FC<ProfileFilterExampleProps> = ({
    profiles,
    currentUserId,
    userInterestedIn
}) => {
    const { filteredProfiles, hasMoreProfiles } = useProfileFilter(
        profiles,
        currentUserId,
        userInterestedIn
    );

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
                Profile Filter Results
            </h3>

            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    User interested in: <span className="font-medium">{userInterestedIn}</span>
                </p>
                <p className="text-sm text-gray-600">
                    Total profiles found: <span className="font-medium">{filteredProfiles.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                    Has more profiles: <span className="font-medium">{hasMoreProfiles ? 'Yes' : 'No'}</span>
                </p>
            </div>

            {filteredProfiles.length > 0 ? (
                <div className="space-y-2">
                    <h4 className="font-medium">Filtered Profiles:</h4>
                    {filteredProfiles.map((profile) => (
                        <div key={profile.id} className="p-3 border rounded-lg bg-gray-50">
                            <p className="font-medium">{profile.name}</p>
                            <p className="text-sm text-gray-600">Gender: {profile.gender}</p>
                            <p className="text-sm text-gray-600">Interested in: {profile.interestedIn}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No profiles match your preferences</p>
                    <p className="text-sm">Try adjusting your interestedIn setting</p>
                </div>
            )}
        </div>
    );
};